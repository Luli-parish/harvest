import { useEffect, useState } from 'react'
import api from './axios'

const createEmptyChild = () => ({
  id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  full_name: '',
});

function ManageChildForm({ familyId, onSubmit, onCancel }) {
  const [children, setChildren] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (childId, value) => {
    setChildren(
      children.map((child) => (child.id === childId ? { ...child, full_name: value } : child))
    )
  }

  const handleAddMore = () => {
    setChildren([...children, createEmptyChild()])
  }

  const handleRemoveChild = (childId) => {
    setChildren(children.filter((child) => child.id !== childId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = children.filter((child) => child.full_name?.trim() !== '')
    setSuccessMessage('')
    setErrorMessage('')
    setIsLoading(true)

    try {
      await updateFamilyChildren(
        familyId,
        payload,
        (data) => {
          setChildren(data?.children || payload)
          setSuccessMessage('Children updated successfully.')
          if (onSubmit) {
            setTimeout(() => onSubmit(data?.children || payload), 1500)
          }
        },
        () => {
          setErrorMessage('Failed to update children. Please try again after some time')
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  const getFamilyChildren = async (id = familyId, onSuccess, onError) => {
    try {
      const response = await api.get(`/api/family-children/?family_id=${id}`)
      if (response.status === 200) {
        const children = response.data.children || []
        if (onSuccess) onSuccess(children)
        return children
      }
    } catch (error) {
      console.error('Failed to fetch family children:', error)
      if (onError) onError(error)
      return []
    }
  }

  const updateFamilyChildren = async (id = familyId, childrenData = children, onSuccess, onError) => {
    try {
      const response = await api.put('/api/update-family-children/', {
        family_id: id,
        children: childrenData,
      })

      if (response.status === 200) {
        if (onSuccess) onSuccess(response.data)
        return response.data
      }
    } catch (error) {
      console.error('Failed to update family children:', error)
      if (onError) onError(error)
      return null
    }
  }

  useEffect(() => {
    if (!familyId) return

    setSuccessMessage('')
    setErrorMessage('')
    setIsLoading(true)

    getFamilyChildren(
      familyId,
      (fetchedChildren) => {
        setChildren(fetchedChildren.length > 0 ? fetchedChildren : [])
        setErrorMessage('')
        setSuccessMessage(fetchedChildren.length > 0 ? 'Children loaded successfully.' : '')
      },
      () => {
        setChildren([])
        setSuccessMessage('')
        setErrorMessage('Failed to load children. Please try again after some time')
      }
    ).finally(() => {
      setIsLoading(false)
    })
  }, [familyId])

  useEffect(() => {
    if (!successMessage) return undefined

    const timeoutId = setTimeout(() => {
      setSuccessMessage('')
    }, 7000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [successMessage])

  return (
    <form onSubmit={handleSubmit} className="col-md-6 col-lg-5 p-3 border rounded bg-white" style={{ margin: '0 auto' }}>
      <h5 className="mb-3">Manage Children</h5>
      {successMessage ? (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      ) : null}
      {isLoading ? (
        <div className="alert alert-info" role="alert">
          Loading...
        </div>
      ) : null}
      {errorMessage ? (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      ) : null}
      {children.map((child) => (
        <div className="mb-3" key={child.id}>
          <label className="form-label">Child Name</label>
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              className="form-control"
              value={child.full_name}
              onChange={e => handleChange(child.id, e.target.value)}
              required
              disabled={isLoading}
            />
            {children.length >= 1 ? (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => handleRemoveChild(child.id)}
                disabled={isLoading}
                aria-label="Delete child input"
                title="Delete child input"
              >
                &times;
              </button>
            ) : null}
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline-secondary mb-3" onClick={handleAddMore} disabled={isLoading || Boolean(errorMessage)}>
        {children.length >= 1 ? 'Add More' : 'Add Child'}
      </button>
      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-primary" disabled={isLoading || Boolean(errorMessage)}>
          Submit
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ManageChildForm
