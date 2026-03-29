import React, { useEffect, useState } from 'react';
import api from './axios';
import UpdateFamilyPaymentForm from './UpdateFamilyPaymentForm';
import ManageChildForm from './ManageChildForm';

function FamilyPaymentsTable({ familyId, familyName, onBack }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAddChildForm, setShowAddChildForm] = useState(false);

  useEffect(() => {
    if (!familyId) return;
    setLoading(true);
    setError(null);
    api.get(`/api/family-payments/?family_id=${familyId}`)
      .then((response) => {
        setPayments(response.data.payments || []);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load payments');
        setPayments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [familyId, showForm]);

  const handleAddPaymentClick = () => {
    setShowForm(true);
  };

  const handlePaymentSubmitSuccess = () => {
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleBackClick = () => {
    if (onBack) onBack();
  };

  const handleAddChildClick = () => {
    setShowAddChildForm(true);
  };

  const handleAddChildCancel = () => {
    setShowAddChildForm(false);
  };

  const handleAddChildSubmit = (children) => {
    setShowAddChildForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border" role="status" style={{ color: '#304078' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  if (showForm) {
    return (
      <UpdateFamilyPaymentForm
        familyId={familyId}
        familyName={familyName}
        onSubmitSuccess={handlePaymentSubmitSuccess}
        onCancel={handleCancel}
      />
    );
  }

  if (showAddChildForm) {
    return (
      <div className="container">
        <ManageChildForm
          familyId={familyId}
          onSubmit={handleAddChildSubmit}
          onCancel={handleAddChildCancel}
        />
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="container">
        <div className="d-flex gap-2 justify-content-between align-items-center mt-3 mb-2">
          <button className="btn btn-secondary" type="button" onClick={handleBackClick}>
            ← Back to Families
          </button>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="button" onClick={handleAddPaymentClick}>
              + Add Payment
            </button>
            <button className="btn btn-primary" type="button" onClick={handleAddChildClick}>
              + Manage Children
            </button>
          </div>
        </div>
        <div>No payments found for this family.</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="container">
      <div className="d-flex gap-2 justify-content-between align-items-center mt-3 mb-2">
        <button className="btn btn-secondary" type="button" onClick={handleBackClick}>
          ← Back to Families
        </button>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="button" onClick={handleAddPaymentClick}>
            + Add Payment
          </button>
          <button className="btn btn-primary" type="button" onClick={handleAddChildClick}>
            + Manage Children
          </button>
        </div>
      </div>
      <div className="table-responsive mt-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className='px-3'>Payer</th>
              <th className='px-3'>Amount</th>
              <th className='px-3'>Payment Date</th>
              <th className='px-3'>Payment Method</th>
              <th className='px-3'>Inserted By</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td className='px-3'>{payment.payer_name}</td>
                <td className='px-3'>{payment.amount}</td>
                <td className='px-3'>{formatDate(payment.payment_date)}</td>
                <td className='px-3'>{payment.payment_method}</td>
                <td className='px-3'>{payment.created_by || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FamilyPaymentsTable;
