import React, { useEffect, useState } from 'react';
import api from './axios';
import UpdateFamilyPaymentForm from './UpdateFamilyPaymentForm';

function FamilyPaymentsTable({ familyId, familyName, accessToken, onPaymentAdded, onBack }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
    if (onPaymentAdded) onPaymentAdded();
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleBackClick = () => {
    if (onBack) onBack();
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
        accessToken={accessToken}
        onSubmitSuccess={handlePaymentSubmitSuccess}
        onCancel={handleCancel}
      />
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
          <button className="btn btn-secondary" type="button" onClick={handleBackClick}>
            ← Back to Families
          </button>
          <button className="btn btn-primary" type="button" onClick={handleAddPaymentClick}>
            + Add Payment
          </button>
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
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <button className="btn btn-secondary" type="button" onClick={handleBackClick}>
          ← Back to Families
        </button>
        <button className="btn btn-primary" type="button" onClick={handleAddPaymentClick}>
          + Add Payment
        </button>
      </div>
      <div className="table-responsive mt-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td className='px-4'>{payment.amount}</td>
                <td className='px-4'>{formatDate(payment.payment_date)}</td>
                <td className='px-4'>{payment.payment_method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FamilyPaymentsTable;
