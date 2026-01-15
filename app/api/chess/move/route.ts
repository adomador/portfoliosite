import { NextRequest, NextResponse } from 'next/server'

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

// Reset game (for when game ends)
async function resetGame() {
  const ChessClass = await getChess()
  gameInstance = new ChessClass()
  return gameInstance
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, promotion } = body

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: from and to' },
        { status: 400 }
      )
    }

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

    // Validate move
    let move
    try {
      move = game.move({
        from,
        to,
        promotion: promotion || 'q' // Default to queen promotion
      })
    } catch (err: any) {
      console.error('Error making move:', err)
      return NextResponse.json(
        { error: 'Invalid move', message: err.message },
        { status: 400 }
      )
    }

    if (!move) {
      return NextResponse.json(
        { error: 'Invalid move' },
        { status: 400 }
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

    // If game is over, reset for next game
    if (isCheckmate || isStalemate || isDraw) {
      // Don't reset immediately - let users see the final state
      // Game will reset when a new move is attempted after game end
    }

    return NextResponse.json({
      fen,
      turn,
      status,
      isCheck,
      isCheckmate,
      isStalemate,
      isDraw,
      move: {
        from: move.from,
        to: move.to,
        san: move.san
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to make move', message: error.message },
      { status: 500 }
    )
  }
}

// PUT endpoint for admin moves (your moves)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, promotion, reset } = body

    // Allow resetting the game
    if (reset) {
      const game = await resetGame()
      return NextResponse.json({
        fen: game.fen(),
        turn: 'white',
        status: 'active',
        isCheck: false,
        isCheckmate: false,
        isStalemate: false,
        isDraw: false
      })
    }

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: from and to' },
        { status: 400 }
      )
    }

    const game = await getGame()

    // Validate move
    const move = game.move({
      from,
      to,
      promotion: promotion || 'q'
    })

    if (!move) {
      return NextResponse.json(
        { error: 'Invalid move' },
        { status: 400 }
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
      isDraw,
      move: {
        from: move.from,
        to: move.to,
        san: move.san
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to make move', message: error.message },
      { status: 500 }
    )
  }
}
