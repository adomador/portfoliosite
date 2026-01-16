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

// Map for notation (uppercase for white pieces)
const NOTATION_SYMBOLS: Record<string, string> = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘'
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
  const [isMounted, setIsMounted] = useState(false)
  const [moveHistory, setMoveHistory] = useState<string[]>([])

  // Track when component is mounted to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load chess.js only on client side
  useEffect(() => {
    import('chess.js').then((module) => {
      setChess(() => module.Chess)
      setGame(new module.Chess())
    })
  }, [])

  // Fetch game state from API
  const fetchGameState = useCallback(async () => {
    if (!Chess) return
    
    try {
      const response = await fetch('/api/chess/game')
      if (!response.ok) throw new Error('Failed to fetch game state')
      const data = await response.json()
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Chessboard.tsx:69',message:'API response received',data:{hasHistory:!!data.history,historyLength:data.history?.length||0,history:data.history,fen:data.fen?.substring(0,30)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Only update if FEN has changed
      setGameState(prev => {
        if (data.fen !== prev.fen) {
          const newGame = new Chess(data.fen)
          setGame(newGame)
          setIsVisitorTurn(data.turn === 'white')
          setSelectedSquare(null)
          setValidMoves([])
          
          // Update move history from API if available
          if (data.history && Array.isArray(data.history)) {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Chessboard.tsx:83',message:'Updating moveHistory from fetchGameState (visitor)',data:{historyLength:data.history.length,history:data.history,fenChanged:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            setMoveHistory(data.history)
          }
          
          return {
            fen: data.fen,
            turn: data.turn,
            status: data.status,
            isCheck: data.isCheck || false,
            isCheckmate: data.isCheckmate || false,
            isStalemate: data.isStalemate || false
          }
        } else {
          // FEN hasn't changed, but check if history was updated
          if (data.history && Array.isArray(data.history)) {
            setMoveHistory(prevHistory => {
              if (JSON.stringify(prevHistory) !== JSON.stringify(data.history)) {
                return data.history
              }
              return prevHistory
            })
          }
        }
        return prev
      })
    } catch (err) {
      console.error('Error fetching game state:', err)
    }
  }, [Chess])

  // Poll for game state updates every 2.5 seconds
  useEffect(() => {
    fetchGameState()
    const interval = setInterval(fetchGameState, 2500)
    return () => clearInterval(interval)
  }, [fetchGameState])

  // Get board representation
  const getBoard = (): Board => {
    if (!Chess) return Array(8).fill(null).map(() => Array(8).fill(null))
    
    // Use gameState.fen instead of game.fen() to avoid stale state
    const board: Board = []
    const fen = gameState.fen
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
    if (!Chess) return
    
    // Use gameState.turn instead of game.turn() to avoid stale state issues
    const currentTurn = gameState.turn === 'white' ? 'w' : 'b'
    
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
        if (piece && piece === piece.toUpperCase() && currentTurn === 'w') {
          selectSquare(row, col)
        } else {
          // Deselect
          setSelectedSquare(null)
          setValidMoves([])
        }
      }
    } else {
      // Select a piece
      if (piece && piece === piece.toUpperCase() && currentTurn === 'w') {
        selectSquare(row, col)
      }
    }
  }

  // Select a square and show valid moves
  const selectSquare = (row: number, col: number) => {
    if (!Chess) return
    
    // Use gameState.fen to create a fresh game instance to avoid stale state
    const freshGame = new Chess(gameState.fen)
    const squareName = getSquareName(row, col)
    setSelectedSquare(squareName)
    setError(null)

    // Get valid moves for this piece using fresh game instance
    const moves = freshGame.moves({ square: squareName as any, verbose: true })
    const destinations = moves.map(move => move.to)
    setValidMoves(destinations)
  }

  // Format move notation with Unicode symbols
  const formatMoveNotation = (move: string): string => {
    // Replace piece letters with Unicode symbols
    let formatted = move
    for (const [letter, symbol] of Object.entries(NOTATION_SYMBOLS)) {
      // Match piece at start of move (e.g., "Nf3" -> "♘f3")
      formatted = formatted.replace(new RegExp(`^${letter}`, 'g'), symbol)
      // Match piece in captures (e.g., "Nxf3" -> "♘xf3")
      formatted = formatted.replace(new RegExp(`${letter}x`, 'g'), `${symbol}x`)
    }
    return formatted
  }

  // Get formatted move history
  const getMoveHistory = (): Array<{ moveNumber: number; white: string | null; black: string | null }> => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Chessboard.tsx:225',message:'getMoveHistory called (visitor)',data:{moveHistoryLength:moveHistory.length,moveHistory:moveHistory},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (moveHistory.length === 0) return []
    
    const formattedHistory: Array<{ moveNumber: number; white: string | null; black: string | null }> = []
    
    for (let i = 0; i < moveHistory.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1
      const white = moveHistory[i] ? formatMoveNotation(moveHistory[i]) : null
      const black = moveHistory[i + 1] ? formatMoveNotation(moveHistory[i + 1]) : null
      formattedHistory.push({ moveNumber, white, black })
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Chessboard.tsx:239',message:'getMoveHistory formatted (visitor)',data:{formattedLength:formattedHistory.length,formattedHistory:formattedHistory.map(h=>({num:h.moveNumber,white:h.white,black:h.black}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return formattedHistory
  }

  // Make a move
  const makeMove = async (from: string, to: string) => {
    if (!Chess || !game) return
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chess/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to })
      })

      let data
      try {
        data = await response.json()
      } catch (e) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Invalid move')
      }

      // Update local game state immediately
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
      
      // Update move history from API response (contains full history)
      if (data.history && Array.isArray(data.history)) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Chessboard.tsx:280',message:'Updating moveHistory from makeMove response (visitor)',data:{historyLength:data.history.length,history:data.history,hasMoveData:!!data.move},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        setMoveHistory(data.history)
      } else if (data.move && data.move.san) {
        // Fallback: append move if history not provided
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Chessboard.tsx:285',message:'Fallback: appending move to history (visitor)',data:{san:data.move.san,prevLength:moveHistory.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        setMoveHistory(prev => [...prev, data.move.san])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to make move')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while chess.js is loading or component is not mounted
  if (!isMounted || !Chess || !gameState.fen) {
    return (
      <div className={styles.chessSection}>
        <div className={styles.chessHeader}>
        </div>
        <div className={styles.loadingMessage}>Loading chessboard...</div>
      </div>
    )
  }

  const board = getBoard()

  return (
    <div className={styles.chessSection}>
      <div className={styles.chessHeader}>
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
              {isVisitorTurn ? 'Your turn' : 'My move'}
            </span>
          )}
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.chessboardContainer}>
        <div className={styles.chessboardWrapper}>
          <div className={styles.chessboard}>
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.chessRow}>
                {row.map((piece, colIndex) => {
                  const squareName = getSquareName(rowIndex, colIndex)
                  const isLight = (rowIndex + colIndex) % 2 === 1
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
        
        <div className={styles.notationPanel}>
          <div className={styles.notationList}>
            {getMoveHistory().map((entry) => (
              <div key={entry.moveNumber} className={styles.notationRow}>
                <div className={styles.moveNumber}>{entry.moveNumber}.</div>
                <div className={styles.whiteMove}>{entry.white || ''}</div>
                <div className={styles.blackMove}>{entry.black || ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <div className={styles.loadingMessage}>Processing move...</div>}

      <div className={styles.chessFooter}>
        <p className={styles.chessDescription}>
          Make your move. Visitors play as white, and I play as black. 
        </p>
      </div>
    </div>
  )
}
