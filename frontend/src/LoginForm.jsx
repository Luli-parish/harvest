import { useState } from 'react'
import api from './axios'

export default function LoginForm({ onLogin, onSwitchToSignup }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }
    try {
      setLoading(true)
      const resp = await api.post('/api/token/', { username, password })
      const access = resp.data.access
      if (onLogin) onLogin(access, username)
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="col-md-5 card p-4"
        style={{ margin: '0 auto' }}
      >
        <h5 className="mb-3">Login</h5>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
      <div className="mt-3 text-center">
        <span>Don't have an account?{' '}
          {onSwitchToSignup ? (
            <a href="#" onClick={e => { e.preventDefault(); onSwitchToSignup(); }} className="text-primary fw-bold">Create account</a>
          ) : (
            <span className="text-muted">Sign up</span>
          )}
        </span>
      </div>
    </div>
  )
}
