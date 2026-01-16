// Shared game state for chess API routes
// Uses Upstash Redis for persistent storage across serverless function restarts

import { Redis } from '@upstash/redis'

let Chess: any = null
const GAME_STATE_KEY = 'chess-game-state'
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

// Initialize game from KV storage
export async function getGame() {
  const ChessClass = await getChess()
  const fen = await getGameFromKV()
  const gameInstance = new ChessClass(fen)
  return gameInstance
}

// Reset game (for when game ends or admin reset)
export async function resetGame() {
  const ChessClass = await getChess()
  const gameInstance = new ChessClass(STARTING_FEN)
  // Save reset state to KV
  await saveGameToKV(STARTING_FEN)
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
