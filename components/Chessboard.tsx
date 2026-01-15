'use client'
import { useState, useEffect, useCallback } from 'react'
import styles from './Chessboard.module.css'

// Type for Chess class
type ChessClass = typeof import('chess.js').Chess
type ChessInstance = InstanceType<ChessClass>

type Square = string | null
type Board = Square[][]

interface GameState {
  fen: string
  turn: 'white' | 'black'
  status: string
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
}

const PIECE_SYMBOLS: Record<string, string> = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
}

export default function Chessboard() {
  const [Chess, setChess] = useState<ChessClass | null>(null)
  const [game, setGame] = useState<ChessInstance | null>(null)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [validMoves, setValidMoves] = useState<string[]>([])
  const [gameState, setGameState] = useState<GameState>({
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Starting position
    turn: 'white',
    status: 'active',
    isCheck: false,
    isCheckmate: false,
    isStalemate: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisitorTurn, setIsVisitorTurn] = useState(true) // Visitor plays white

  // Load chess.js only on client side
  useEffect(() => {
    import('chess.js').then((module) => {
      setChess(() => module.Chess)
      setGame(new module.Chess())
    })
  }, [])

  // Fetch game state from API
  const fetchGameState = useCallback(async () => {
    if (!Chess || !game) return
    
    try {
      const response = await fetch('/api/chess/game')
      if (!response.ok) throw new Error('Failed to fetch game state')
      const data = await response.json()
      
      // Only update if FEN has changed
      setGameState(prev => {
        if (data.fen !== prev.fen) {
          const newGame = new Chess(data.fen)
          setGame(newGame)
          setIsVisitorTurn(data.turn === 'white')
          setSelectedSquare(null)
          setValidMoves([])
          return {
            fen: data.fen,
            turn: data.turn,
            status: data.status,
            isCheck: data.isCheck || false,
            isCheckmate: data.isCheckmate || false,
            isStalemate: data.isStalemate || false
          }
        }
        return prev
      })
    } catch (err) {
      console.error('Error fetching game state:', err)
    }
  }, [Chess, game])

  // Poll for game state updates every 2.5 seconds
  useEffect(() => {
    fetchGameState()
    const interval = setInterval(fetchGameState, 2500)
    return () => clearInterval(interval)
  }, [fetchGameState])

  // Get board representation
  const getBoard = (): Board => {
    if (!game) return Array(8).fill(null).map(() => Array(8).fill(null))
    
    const board: Board = []
    const fen = game.fen()
    const parts = fen.split(' ')
    const position = parts[0]
    
    const rows = position.split('/')
    for (const row of rows) {
      const boardRow: Square[] = []
      for (const char of row) {
        if (/\d/.test(char)) {
          // Number represents empty squares
          for (let i = 0; i < parseInt(char); i++) {
            boardRow.push(null)
          }
        } else {
          boardRow.push(char)
        }
      }
      board.push(boardRow)
    }
    return board
  }

  // Get square name from row/col
  const getSquareName = (row: number, col: number): string => {
    const file = String.fromCharCode(97 + col) // a-h
    const rank = 8 - row // 1-8
    return `${file}${rank}`
  }

  // Handle square click
  const handleSquareClick = async (row: number, col: number) => {
    if (!game) return
    
    if (!isVisitorTurn) {
      setError("It's not your turn. Waiting for opponent's move...")
      return
    }

    const squareName = getSquareName(row, col)
    const board = getBoard()
    const piece = board[row][col]

    // If a square is already selected
    if (selectedSquare) {
      // If clicking on a valid move square, make the move
      if (validMoves.includes(squareName)) {
        await makeMove(selectedSquare, squareName)
        setSelectedSquare(null)
        setValidMoves([])
      } else {
        // If clicking on another piece of the same color, select it
        if (piece && piece === piece.toUpperCase() && game.turn() === 'w') {
          selectSquare(row, col)
        } else {
          // Deselect
          setSelectedSquare(null)
          setValidMoves([])
        }
      }
    } else {
      // Select a piece
      if (piece && piece === piece.toUpperCase() && game.turn() === 'w') {
        selectSquare(row, col)
      }
    }
  }

  // Select a square and show valid moves
  const selectSquare = (row: number, col: number) => {
    if (!game) return
    
    const squareName = getSquareName(row, col)
    setSelectedSquare(squareName)
    setError(null)

    // Get valid moves for this piece
    const moves = game.moves({ square: squareName as any, verbose: true })
    const destinations = moves.map(move => move.to)
    setValidMoves(destinations)
  }

  // Make a move
  const makeMove = async (from: string, to: string) => {
    if (!Chess) return
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chess/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid move')
      }

      // Update local game state
      const newGame = new Chess(data.fen)
      setGame(newGame)
      setGameState({
        fen: data.fen,
        turn: data.turn,
        status: data.status,
        isCheck: data.isCheck || false,
        isCheckmate: data.isCheckmate || false,
        isStalemate: data.isStalemate || false
      })
      setIsVisitorTurn(data.turn === 'white')
    } catch (err: any) {
      setError(err.message || 'Failed to make move')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while chess.js is loading
  if (!Chess || !game) {
    return (
      <div className={styles.chessSection}>
        <div className={styles.chessHeader}>
          <h3 className={styles.chessTitle}>Play Chess</h3>
        </div>
        <div className={styles.loadingMessage}>Loading chessboard...</div>
      </div>
    )
  }

  const board = getBoard()

  return (
    <div className={styles.chessSection}>
      <div className={styles.chessHeader}>
        <h3 className={styles.chessTitle}>Play Chess</h3>
        <div className={styles.gameStatus}>
          {gameState.isCheckmate && (
            <span className={styles.statusMessage}>
              {gameState.turn === 'white' ? 'Black' : 'White'} wins by checkmate!
            </span>
          )}
          {gameState.isStalemate && (
            <span className={styles.statusMessage}>Stalemate - Draw!</span>
          )}
          {gameState.isCheck && !gameState.isCheckmate && (
            <span className={styles.statusMessage}>Check!</span>
          )}
          {!gameState.isCheckmate && !gameState.isStalemate && (
            <span className={styles.turnIndicator}>
              {isVisitorTurn ? 'Your turn' : "Waiting for opponent's move..."}
            </span>
          )}
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.chessboardContainer}>
        <div className={styles.chessboard}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.chessRow}>
              {row.map((piece, colIndex) => {
                const squareName = getSquareName(rowIndex, colIndex)
                const isLight = (rowIndex + colIndex) % 2 === 0
                const isSelected = selectedSquare === squareName
                const isValidMove = validMoves.includes(squareName)
                const isLastMove = false // Could track last move for highlighting

                return (
                  <div
                    key={colIndex}
                    className={`${styles.chessSquare} ${isLight ? styles.light : styles.dark} ${isSelected ? styles.selected : ''} ${isValidMove ? styles.validMove : ''}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                  >
                    {piece && (
                      <span className={`${styles.chessPiece} ${piece === piece.toUpperCase() ? styles.whitePiece : styles.blackPiece}`}>
                        {PIECE_SYMBOLS[piece]}
                      </span>
                    )}
                    {isValidMove && !piece && (
                      <div className={styles.moveIndicator} />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {isLoading && <div className={styles.loadingMessage}>Processing move...</div>}

      <div className={styles.chessFooter}>
        <p className={styles.chessDescription}>
          Make your move! Visitors play as white, and I play as black. The game updates automatically.
        </p>
      </div>
    </div>
  )
}
