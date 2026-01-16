'use client'
import { useState, useEffect } from 'react'
import AdminChessboard from '@/components/AdminChessboard'
import styles from './admin.module.css'

const ADMIN_SESSION_KEY = 'chess_admin_session'

export default function AdminChessPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if already authenticated on mount
  useEffect(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY)
    if (session) {
      // Verify session is valid by checking with server
      verifySession(session)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifySession = async (sessionToken: string) => {
    try {
      const response = await fetch('/api/chess/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: sessionToken })
      })
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY)
      }
    } catch (err) {
      localStorage.removeItem(ADMIN_SESSION_KEY)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chess/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok && data.token) {
        localStorage.setItem(ADMIN_SESSION_KEY, data.token)
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setError(data.error || 'Invalid password')
      }
    } catch (err: any) {
      setError('Failed to authenticate. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY)
    setIsAuthenticated(false)
    setPassword('')
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Chess Admin Panel</h1>
          <p className={styles.loginSubtitle}>Enter password to access</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.passwordInput}
              autoFocus
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
            <button type="submit" className={styles.loginButton} disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>Chess Admin Panel</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
      <AdminChessboard />
    </div>
  )
}
