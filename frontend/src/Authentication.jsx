import { useState } from 'react'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'

export default function Authentication({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true)

  const handleSwitchToLogin = () => setShowLogin(true)
  const handleSwitchToSignup = () => setShowLogin(false)
  const handleSignupSuccess = () => handleSwitchToLogin()

  return (
    <div>
      {showLogin ? (
        <LoginForm onLogin={onLogin} onSwitchToSignup={handleSwitchToSignup} />
      ) : (
        <SignupForm onSuccess={handleSignupSuccess} onSwitchToLogin={handleSwitchToLogin} />
      )}
    </div>
  )
}
