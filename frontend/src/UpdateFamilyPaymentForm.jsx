import { useState } from 'react'
import api from './axios'

export default function UpdateFamilyPaymentForm({ familyId, familyName, accessToken, onSubmitSuccess, onCancel }) {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'credit_card', label: 'Credit Card' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!amount) {
      setError('Please enter an amount')
      return
    }

    try {
      setLoading(true)
      const response = await api.put(
        '/api/update-family-payment/',
        {
          family_id: familyId,
          amount: parseFloat(amount),
          payment_method: paymentMethod,
        }
      )

      setSuccess(true)
      setAmount('')
      setPaymentMethod('cash')

      // Call success callback after brief delay to show success message
      setTimeout(() => {
        onSubmitSuccess()
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="col-md-5 card p-4" style={{ margin: '0 auto' }}>
      <h5 className="mb-3">Update Family Payment</h5>

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
          Payment recorded successfully!
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess(false)}
          ></button>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Family Name</label>
        <input
          type="text"
          className="form-control"
          value={familyName}
          disabled
          style={{ backgroundColor: '#f5f5f5' }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Amount</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number"
            className="form-control"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Payment Method</label>
        <select
          className="form-select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          {paymentMethods.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex gap-2 justify-content-end mt-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
