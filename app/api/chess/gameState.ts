// Shared game state for chess API routes
// Uses Upstash Redis for persistent storage across serverless function restarts

import { Redis } from '@upstash/redis'

let Chess: any = null
const GAME_STATE_KEY = 'chess-game-state'
const MOVE_HISTORY_KEY = 'chess-move-history'
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

// Initialize Redis client
let redis: Redis | null = null

function getRedis(): Redis | null {
  // Check if environment variables are set
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Upstash Redis environment variables not set. Game state will not persist.')
    return null
  }
  
  if (!redis) {
    // Upstash Redis will use environment variables:
    // UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redis
}

async function getChess() {
  if (!Chess) {
    try {
      const chessModule = await import('chess.js')
      Chess = chessModule.Chess
      if (!Chess) {
        throw new Error('Chess class not found in chess.js module')
      }
    } catch (err: any) {
      console.error('Failed to import chess.js:', err)
      throw new Error(`Failed to load chess.js: ${err.message}`)
    }
  }
  return Chess
}

// Read game state from Redis
async function getGameFromKV(): Promise<string> {
  try {
    const redisClient = getRedis()
    if (!redisClient) {
      // Redis not configured, return starting position
      return STARTING_FEN
    }
    const fen = await redisClient.get<string>(GAME_STATE_KEY)
    return fen || STARTING_FEN
  } catch (err: any) {
    console.error('Error reading from KV, using default:', err)
    // If KV read fails, default to starting position
    return STARTING_FEN
  }
}

// Save game state to Redis
export async function saveGameToKV(fen: string): Promise<void> {
  try {
    const redisClient = getRedis()
    if (!redisClient) {
      // Redis not configured, skip save (game still works without persistence)
      return
    }
    await redisClient.set(GAME_STATE_KEY, fen)
  } catch (err: any) {
    // Log error but don't throw - game still works in memory for this request
    console.error('Error saving to KV:', err)
  }
}

// Save move history to Redis
export async function saveMoveHistoryToKV(history: string[]): Promise<void> {
  try {
    const redisClient = getRedis()
    if (!redisClient) {
      console.warn('[saveMoveHistoryToKV] Redis not configured, skipping save')
      return
    }
    const historyStr = JSON.stringify(history)
    await redisClient.set(MOVE_HISTORY_KEY, historyStr)
    console.log('[saveMoveHistoryToKV] Saved history to Redis:', historyStr, 'Length:', history.length)
  } catch (err: any) {
    console.error('[saveMoveHistoryToKV] Error saving move history to KV:', err)
  }
}

// Get move history from Redis
export async function getMoveHistoryFromKV(): Promise<string[]> {
  try {
    const redisClient = getRedis()
    if (!redisClient) {
      console.warn('[getMoveHistoryFromKV] Redis not configured, returning empty history')
      return []
    }
    const historyStr = await redisClient.get<string>(MOVE_HISTORY_KEY)
    if (!historyStr || historyStr === null) {
      console.log('[getMoveHistoryFromKV] No history found in Redis, returning empty array')
      return []
    }
    // Handle case where Redis returns the string directly
    const history = typeof historyStr === 'string' ? JSON.parse(historyStr) : historyStr
    console.log('[getMoveHistoryFromKV] Retrieved history from Redis:', JSON.stringify(history), 'Type:', typeof history, 'Length:', Array.isArray(history) ? history.length : 'not an array')
    return Array.isArray(history) ? history : []
  } catch (err: any) {
    console.error('[getMoveHistoryFromKV] Error reading move history from KV:', err)
    return []
  }
}

// Initialize game from KV storage
// Note: Creating from FEN loses move history, so we maintain history separately in Redis
export async function getGame() {
  const ChessClass = await getChess()
  const fen = await getGameFromKV()
  const gameInstance = new ChessClass(fen)
  return gameInstance
}

// Get game with reconstructed history (for reading move history from server-side game)
export async function getGameWithHistory() {
  const ChessClass = await getChess()
  const fen = await getGameFromKV()
  const gameInstance = new ChessClass(fen)
  
  // Try to get history from Redis first
  const redisHistory = await getMoveHistoryFromKV()
  if (redisHistory.length > 0) {
    return { game: gameInstance, history: redisHistory }
  }
  
  // If Redis history is empty, try to get from game instance
  // But note: game instance created from FEN won't have history
  const gameHistory = gameInstance.history()
  return { game: gameInstance, history: gameHistory.length > 0 ? gameHistory : [] }
}

// Reset game (for when game ends or admin reset)
export async function resetGame() {
  const ChessClass = await getChess()
  const gameInstance = new ChessClass(STARTING_FEN)
  // Save reset state to KV
  await saveGameToKV(STARTING_FEN)
  // Clear move history
  await saveMoveHistoryToKV([])
  return gameInstance
}

// Load game from FEN (for persistence if needed)
export async function loadGameFromFen(fen: string) {
  const ChessClass = await getChess()
  const gameInstance = new ChessClass(fen)
  // Save to KV
  await saveGameToKV(fen)
  return gameInstance
}
