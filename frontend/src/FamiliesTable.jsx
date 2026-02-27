import { useState, useEffect } from 'react'
import api from './axios'

export default function FamiliesTable({ accessToken, onSelectFamily }) {
  const [families, setFamilies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddNew = () => {
    onSelectFamily(null, null)
  }

  const filteredFamilies = families.filter((family) =>
    family.family_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    fetchFamilies()
  }, [accessToken])

  const fetchFamilies = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/api/families/')
      setFamilies(response.data.data || [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load families')
      setFamilies([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A'
    return `$${parseFloat(amount).toFixed(2)}`
  }

  const calculateTotalAmount = () => {
    return families.reduce((sum, family) => {
      return sum + (family.total_amount_paid ? parseFloat(family.total_amount_paid) : 0)
    }, 0)
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status" style={{ color: '#304078' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button
          className="btn btn-sm btn-danger ms-2"
          onClick={fetchFamilies}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="card" style={{ backgroundColor: '#fff', color: '#000' }}>
        <div
          className="card-header d-flex justify-content-between align-items-center gap-3"
          style={{
            backgroundColor: '#304078',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
          }}
        >
          <span>Families Payments Summary</span>
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by family name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                maxWidth: '200px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.9rem',
              }}
            />
            <button
              className="btn btn-sm btn-light"
              onClick={handleAddNew}
              style={{ color: '#304078', whiteSpace: 'nowrap', marginLeft: '8px' }}
            >
              + Add New
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ color: '#000' }}>
            <thead>
              <tr style={{ backgroundColor: '#304078', color: '#fff' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Family Name</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>No of Children</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Amount Paid</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Last Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredFamilies.length > 0 ? (
                filteredFamilies.map((family) => (
                  <tr
                    key={family.id}
                    onClick={() => onSelectFamily(family.id, family.family_name)}
                    style={{
                      backgroundColor: '#fff',
                      borderBottom: '1px solid #e0e0e0',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                  >
                    <td style={{ padding: '12px', color: '#000' }}>
                      {family.family_name}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#000' }}>
                      {family.child_count}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#000' }}>
                      {formatCurrency(family.total_amount_paid)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#000' }}>
                      {formatDate(family.last_payment_date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#000' }}>
                    No families found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div
          className="card-footer"
          style={{
            backgroundColor: '#f8f9fa',
            color: '#000',
            fontSize: '0.9rem',
            textAlign: 'right',
            display: 'flex',
            justifyContent: 'space-between',
            paddingRight: '15px',
          }}
        >
          <span>Total amount: <strong>{formatCurrency(calculateTotalAmount())}</strong></span>
          <span>Showing <strong>{filteredFamilies.length}</strong> of <strong>{families.length}</strong> families</span>
        </div>
      </div>
    </div>
  )
}
