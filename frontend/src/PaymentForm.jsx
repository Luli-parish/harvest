import { useState } from 'react'
import api from './axios'

export default function PaymentForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    family_name: '',
    category: 'family_one_child',
    child_count: '',
    amount: '',
    payment_method: 'bank_transfer',
    payer_name: '',
    mobile_number: '',
  })
  const categoryOptions = [
    { value: 'executive', label: 'Executive' },
    { value: 'committee_with_family', label: 'Committee with Family' },
    { value: 'single_committee', label: 'Single Committee' },
    { value: 'family_one_child', label: 'Family with one child' },
    { value: 'family_multiple_children', label: 'Family with multiple children' },
    { value: 'grandparents', label: 'Grandparents' },
  ]

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
      if (!formData.family_name || !formData.amount || !formData.payment_method || !formData.payer_name) {
        setError('All fields are required')
        setLoading(false)
        return
      }

      const response = await api.post(
        '/api/add-family-payment/',
        {
          family_name: formData.family_name,
          category: formData.category,
          child_count: formData.child_count ? parseInt(formData.child_count) : 0,
          amount: formData.amount,
          payment_method: formData.payment_method,
          payer_name: formData.payer_name,
          mobile_number: formData.mobile_number,
        }
      )

      setSuccess(`Payment created successfully!`)
      
      // Reset form
      setFormData({
        family_name: '',
        category: 'family_one_child',
        child_count: '',
        amount: '',
        payment_method: 'bank_transfer',
        payer_name: '',
        mobile_number: '',
      })

      // Call callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
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
                    placeholder="e.g., Last Name First Name(s)"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="child_count" className="form-label">
                    Number of Children
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
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="mobile_number" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="mobile_number"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="e.g., +1234567890"
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

                <div className="mb-3">
                  <label htmlFor="payer_name" className="form-label">
                    Payer's Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="payer_name"
                    name="payer_name"
                    value={formData.payer_name}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    required
                  />
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
