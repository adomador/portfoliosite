// Shared game state for chess API routes
// This ensures both /api/chess/game and /api/chess/move use the same game instance

let Chess: any = null
let gameInstance: any = null

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

// Initialize game if it doesn't exist
export async function getGame() {
  if (!gameInstance) {
    const ChessClass = await getChess()
    gameInstance = new ChessClass()
  }
  return gameInstance
}

// Reset game (for when game ends or admin reset)
export async function resetGame() {
  const ChessClass = await getChess()
  gameInstance = new ChessClass()
  return gameInstance
}

// Load game from FEN (for persistence if needed)
export async function loadGameFromFen(fen: string) {
  const ChessClass = await getChess()
  gameInstance = new ChessClass(fen)
  return gameInstance
}
