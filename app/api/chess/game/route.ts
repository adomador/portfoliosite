import { NextResponse } from 'next/server'
import { getGame, getMoveHistoryFromKV, getGameWithHistory } from '../gameState'

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

    // Get move history - try Redis first, fallback to game instance history
    let history = await getMoveHistoryFromKV()
    
    // If Redis is empty but game has history, use game history (shouldn't happen with FEN, but just in case)
    if (history.length === 0) {
      const gameHistory = game.history()
      history = gameHistory.length > 0 ? gameHistory : []
    }
    
    console.log('[GET /api/chess/game] History:', JSON.stringify(history), 'Length:', history.length, 'FEN:', fen.substring(0, 50))

    return NextResponse.json({
      fen,
      turn,
      status,
      isCheck,
      isCheckmate,
      isStalemate,
      isDraw,
      history
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch game state', message: error.message },
      { status: 500 }
    )
  }
}
