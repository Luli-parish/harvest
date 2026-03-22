import { useState } from 'react'
import api from './axios'

function ChangePasswordForm({ onSubmitSuccess, onCancel }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('All fields are required.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.')
      return
    }
    setIsLoading(true)
    try {
      const response = await api.post('/api/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      })
      setSuccess('Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      if (onSubmitSuccess) {
        setTimeout(() => {
          onSubmitSuccess()
        }, 1500)
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error)
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-white" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h5 className="mb-3">Change Password</h5>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}
      <div className="mb-3">
        <label className="form-label">Current Password</label>
        <input
          type="password"
          className="form-control"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
          disabled={isLoading}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">New Password</label>
        <input
          type="password"
          className="form-control"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
          disabled={isLoading}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Confirm New Password</label>
        <input
          type="password"
          className="form-control"
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          autoComplete="new-password"
          required
          disabled={isLoading}
        />
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </div>
    </form>
  )
}

export default ChangePasswordForm
