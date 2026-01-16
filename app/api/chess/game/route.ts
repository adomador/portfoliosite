import { NextResponse } from 'next/server'
import { getGame } from '../gameState'

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
