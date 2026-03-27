import { useState, useEffect } from 'react'
import api from './axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import PaymentForm from './PaymentForm'
import FamiliesTable from './FamiliesTable'
import FamilyPaymentsTable from './FamilyPaymentsTable'
import Authentication from './Authentication'
import ChangePasswordForm from './ChangePasswordForm'
import './App.css'

function App() {
  const [accessToken, setAccessToken] = useState(null)
  const [username, setUsername] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [editingFamily, setEditingFamily] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showChangePassword, setShowChangePassword] = useState(false)
  // Restore session from localStorage if present
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken')
    const savedUser = localStorage.getItem('username')
    if (savedToken) {
      setAccessToken(savedToken)
      if (savedUser) setUsername(savedUser)
    }

    // Setup axios response interceptor for 401 errors
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (localStorage.getItem('accessToken') && error.response?.status === 401) {
          // Token expired or invalid, log out user
          localStorage.removeItem('accessToken')
          localStorage.removeItem('username')
          setAccessToken(null)
          setUsername(null)
          setShowPaymentForm(false)
          setLoginError('Your session has expired. Please log in again.')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      api.interceptors.response.eject(responseInterceptor)
    }
  }, [])

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (error) {
      console.error('Failed to decode token:', error)
      return null
    }
  }

  const onLogin = (access, usernameArg) => {
    // persist token and username
    localStorage.setItem('accessToken', access)
    if (usernameArg) localStorage.setItem('username', usernameArg)
    // api instance now handles Authorization header automatically
    setAccessToken(access)
    setUsername(usernameArg)
    setLoginError(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('username')
    // api instance now handles Authorization header automatically
    setAccessToken(null)
    setUsername(null)
    setShowPaymentForm(false)
    setShowChangePassword(false)
  }

  const handleSelectFamily = (familyId, familyName) => {
    if (familyId && familyName) {
      return setEditingFamily({ id: familyId, name: familyName })
    }
  }

  const handleShowPaymentForm = () => {
    return setShowPaymentForm(true)
  }

  const handleCancelEdit = () => {
    setShowPaymentForm(false)
  }

  const handlePaymentSubmitSuccess = () => {
    setShowPaymentForm(false)
    setRefreshTrigger((prev) => prev + 1)
  }

  const renderPage = () => {
    if (!accessToken) {
      return (
        <div className="container">
          <Authentication onLogin={onLogin} />
        </div>
      )
    }
    if (showChangePassword) {
      return (
        <div className="container">
          <ChangePasswordForm
            onCancel={() => setShowChangePassword(false)}
            onSubmitSuccess={handleLogout}
          />
        </div>
      )
    }
    if (editingFamily) {
      return (
        <FamilyPaymentsTable
          familyId={editingFamily.id}
          familyName={editingFamily.name}
          onBack={() => setEditingFamily(null)}
        />
      )
    }
    if (showPaymentForm) {
      return (
        <PaymentForm
          onSuccess={handlePaymentSubmitSuccess}
          onCancel={handleCancelEdit}
        />
      )
    }
    return (
      <FamiliesTable
        accessToken={accessToken}
        onSelectFamily={handleSelectFamily}
        showPaymentForm={handleShowPaymentForm}
        key={refreshTrigger}
      />
    )
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">

      <nav className="navbar navbar-dark" style={{ backgroundColor: '#304078' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <span className="navbar-brand mb-0 h1">🌾 Harvest Payment System</span>
          {username ? (
            <div className="d-flex align-items-center">
              <span className="text-white me-3">👤 {username}</span>
              <button
                className="btn btn-sm btn-outline-warning me-2"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </button>
              <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </nav>

      <main className="py-4">
        {loginError && (
          <div className="container">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Authentication Error</h4>
              <p>{loginError}</p>
            </div>
          </div>
        )}
        {renderPage()}
      </main>

      <footer className="bg-light py-4 mt-5">
        <div className="container text-center">
          <p className="text-muted mb-0">
            © 2026 Luli Parish. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
