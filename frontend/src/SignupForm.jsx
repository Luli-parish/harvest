import { useState } from 'react'
import api from './axios'

export default function SignupForm({ onSuccess, onCancel, onSwitchToLogin}) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    password: '',
    confirm_password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.mobile_no || !formData.password || !formData.confirm_password) {
      setError('All fields are required')
      setLoading(false)
      return
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await api.post('/api/signup/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        mobile_no: formData.mobile_no,
        password: formData.password,
      })
      setSuccess('Signup successful!')
      
      if (onSuccess) {
        setTimeout(() => { onSuccess(response.data) }, 1500)
      }
        
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        mobile_no: '',
        password: '',
        confirm_password: '',
      })
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header text-white" style={{ backgroundColor: '#304078' }}>
              <h4 className="mb-0">Create Account</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
              )}
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {success}
                  <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">First Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">Last Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                  <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="mobile_no" className="form-label">Mobile Number <span className="text-danger">*</span></label>
                  <input type="tel" className="form-control" id="mobile_no" name="mobile_no" value={formData.mobile_no} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
                  <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirm_password" className="form-label">Confirm Password <span className="text-danger">*</span></label>
                  <input type="password" className="form-control" id="confirm_password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                  {onCancel && (
                    <button type="button" className="btn btn-secondary flex-grow-1" onClick={onCancel} disabled={loading}>Cancel</button>
                  )}
                </div>
              </form>
              <div className="mt-3 text-center">
                <span>Already have an account?{' '}
                  {onSwitchToLogin ? (
                    <a href="#" onClick={e => { e.preventDefault(); onSwitchToLogin(); }} className="text-primary fw-bold">Login here</a>
                  ) : (
                    <span className="text-muted">Login</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
