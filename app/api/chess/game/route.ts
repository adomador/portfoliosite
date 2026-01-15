import { NextResponse } from 'next/server'

// Lazy load chess.js to avoid bundling issues
let Chess: any = null
let gameInstance: any = null

async function getChess() {
  if (!Chess) {
    const chessModule = await import('chess.js')
    Chess = chessModule.Chess
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
    const game = await getGame()
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
