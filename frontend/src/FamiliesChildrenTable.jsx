import { useState, useEffect } from 'react'
import api from './axios'

export default function FamiliesChildrenTable() {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredChildren = children.filter((child) =>
    child.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (child.family_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/api/children/')
      setChildren(response.data.data || [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load children')
      setChildren([])
    } finally {
      setLoading(false)
    }
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
        <button className="btn btn-sm btn-danger ms-2" onClick={fetchChildren}>
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
          <span>Children Summary</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by child or family name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              maxWidth: '250px',
              padding: '0.4rem 0.75rem',
              fontSize: '0.9rem',
            }}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ color: '#000' }}>
            <thead>
              <tr style={{ backgroundColor: '#304078', color: '#fff' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Child Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Family Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredChildren.length > 0 ? (
                filteredChildren.map((child, index) => (
                  <tr
                    key={`${child.full_name}-${index}`}
                    style={{
                      backgroundColor: '#fff',
                      borderBottom: '1px solid #e0e0e0',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                  >
                    <td style={{ padding: '12px', color: '#000' }}>{child.full_name}</td>
                    <td style={{ padding: '12px', color: '#000' }}>{child.family_name || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ padding: '20px', textAlign: 'center', color: '#000' }}>
                    No children found
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
          }}
        >
          Showing <strong>{filteredChildren.length}</strong> of <strong>{children.length}</strong> children
        </div>
      </div>
    </div>
  )
}
