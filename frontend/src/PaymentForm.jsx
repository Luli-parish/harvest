import { useState } from 'react'
import axios from 'axios'

export default function PaymentForm({ accessToken, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    family_name: '',
    child_count: '',
    amount: '',
    payment_method: 'bank_transfer',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'credit_card', label: 'Credit Card' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate required fields
      if (!formData.family_name || !formData.child_count || !formData.amount || !formData.payment_method) {
        setError('All fields are required')
        setLoading(false)
        return
      }

      const response = await axios.post(
        '/api/add-family-payment/',
        {
          family_name: formData.family_name,
          child_count: parseInt(formData.child_count),
          amount: formData.amount,
          payment_method: formData.payment_method,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      setSuccess(`Payment created successfully! Family ID: ${response.data.family_id}, Payment ID: ${response.data.payment_id}`)
      
      // Reset form
      setFormData({
        family_name: '',
        child_count: '',
        amount: '',
        payment_method: 'bank_transfer',
      })

      // Call callback if provided
      if (onSuccess) onSuccess(response.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create payment')
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
              <h4 className="mb-0">Create Family Payment</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}

              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {success}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccess(null)}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="family_name" className="form-label">
                    Family Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="family_name"
                    name="family_name"
                    value={formData.family_name}
                    onChange={handleChange}
                    placeholder="e.g., Smith Family"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="child_count" className="form-label">
                    Number of Children <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="child_count"
                    name="child_count"
                    value={formData.child_count}
                    onChange={handleChange}
                    placeholder="e.g., 3"
                    min="0"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Amount <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="e.g., 150.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="payment_method" className="form-label">
                    Payment Method <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="payment_method"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    required
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                  {onCancel && (
                    <button
                      type="button"
                      className="btn btn-secondary flex-grow-1"
                      onClick={onCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
