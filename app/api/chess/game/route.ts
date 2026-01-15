import { NextResponse } from 'next/server'

// Lazy load chess.js to avoid bundling issues
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
async function getGame() {
  if (!gameInstance) {
    const ChessClass = await getChess()
    gameInstance = new ChessClass()
  }
  return gameInstance
}

export async function GET() {
  try {
    let game
    try {
      game = await getGame()
    } catch (err: any) {
      console.error('Error getting game instance:', err)
      return NextResponse.json(
        { error: 'Failed to initialize game', message: err.message },
        { status: 500 }
      )
    }

    if (!game) {
      return NextResponse.json(
        { error: 'Game instance is null' },
        { status: 500 }
      )
    }
    const fen = game.fen()
    const turn = game.turn() === 'w' ? 'white' : 'black'
    
    // Check game status
    const isCheck = game.isCheck()
    const isCheckmate = game.isCheckmate()
    const isStalemate = game.isStalemate()
    const isDraw = game.isDraw()
    
    let status = 'active'
    if (isCheckmate) {
      status = 'checkmate'
    } else if (isStalemate) {
      status = 'stalemate'
    } else if (isDraw) {
      status = 'draw'
    } else if (isCheck) {
      status = 'check'
    }

    return NextResponse.json({
      fen,
      turn,
      status,
      isCheck,
      isCheckmate,
      isStalemate,
      isDraw
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch game state', message: error.message },
      { status: 500 }
    )
  }
}
