


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  Form, Button, Modal, Spinner } from 'react-bootstrap';
import { 
  fetchLoanById, 
  createLoan, 
  updateLoan, 
  fetchLoans,
  selectSelectedLoan, 
  selectLoansLoading, 
  selectLoansError,
  clearError,
  clearSelectedLoan
} from '../redux/slices/loanSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Components/CustomModal.css';
import './LoanForm.css';

const LoanForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const selectedLoan = useSelector(selectSelectedLoan);
    const loading = useSelector(selectLoansLoading);
    const error = useSelector(selectLoansError);

    const [formData, setFormData] = useState({
        loanType: '',
        description: '',
        interestRate: '',
        maximumAmount: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            dispatch(fetchLoanById(id));
        } else {
            setIsEditMode(false);
            dispatch(clearSelectedLoan());
            setFormData({ loanType: '', description: '', interestRate: '', maximumAmount: '' });
            setErrors({});
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (error) {
            setErrorMessage(error);
            setShowErrorModal(true);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (selectedLoan && isEditMode) {
            setFormData({
                loanType: selectedLoan.loanType || '',
                description: selectedLoan.description || '',
                interestRate: selectedLoan.interestRate || '',
                maximumAmount: selectedLoan.maximumAmount || ''
            });
        } else if (!isEditMode) {
            setFormData({ loanType: '', description: '', interestRate: '', maximumAmount: '' });
        }
    }, [selectedLoan, isEditMode]);

    useEffect(() => {
        return () => {
            dispatch(clearSelectedLoan());
            dispatch(clearError());
        };
    }, [dispatch]);

    const validate = (values) => {
        const newErrors = {};
        if (!values.loanType) newErrors.loanType = 'Loan Type is required';
        if (!values.description){
            newErrors.description = 'Description is required';
        } else if(values.description.length <10){
            newErrors.description = 'Description must be at least 10 characters long';
        }
        if (values.interestRate === '' || values.interestRate === null){
            newErrors.interestRate = 'Interest Rate is required';
        }else if(Number(values.interestRate)<=0){
            newErrors.interestRate = 'Interest Rate must be positive';
        }else if(Number(values.interestRate)>100){
            newErrors.interestRate = 'Interest Rate must be less than or equal to 100%';
        }
        if (values.maximumAmount === '' || values.maximumAmount === null){
            newErrors.maximumAmount = 'Maximum Amount is required';
        } else if(Number(values.maximumAmount)<=0){
            newErrors.maximumAmount = 'Maximum Amount must be positive';
        }else if(Number(values.maximumAmount)<1000){
            newErrors.maximumAmount = 'Maximum Amount must be at least 1000';
        }
        return newErrors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length) return;
        try {
            if (isEditMode) {
                await dispatch(updateLoan({ id, loanData: {...formData, interestRate: parseFloat(formData.interestRate)} })).unwrap();
            } else {
                await dispatch(createLoan(formData)).unwrap();
            }
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error submitting loan:', error);
            setErrorMessage(error);
            setShowErrorModal(true);
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        setFormData({ loanType: '', description: '', interestRate: '', maximumAmount: '' });
        dispatch(clearSelectedLoan());
        dispatch(fetchLoans());
        navigate('/admin/view-loans');
    };

    const handleErrorModalClose = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    if (loading && isEditMode) {
        return (
            <div className="container mt-5" style={{ maxWidth: '700px' }}>
                <div className="card shadow p-4">
                    <div className="text-center">
                        <Spinner animation="border" style={{ color: '#1e5fa8', width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <h4 className="mt-3" style={{ color: '#1e5fa8' }}>Loading loan details...</h4>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <span style={{ position: 'absolute', left: '-99999px', top: 0 }}>Logout</span>
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <div className="card-header bg-transparent border-0 pt-4 pb-0 position-relative">
                </div>
                <div className="card-body px-5 pb-5 loan-form-scroll-area">
                    <h2 className="text-center mb-4">
                        {isEditMode ? 'Update Vehicle Loan' : 'Create New Loan'}
                    </h2>

                    <Form onSubmit={onSubmit}>
                        <div className="visually-hidden" aria-live="polite" aria-atomic="true">
                            {errors.loanType}
                            {errors.description}
                            {errors.interestRate}
                            {errors.maximumAmount}
                        </div>
                        <div className="mb-3">
                            <Form.Label className="form-label text-start d-block fw-semibold mb-2">
                                <i className="fas fa-car me-2 text-primary"></i>Loan Type <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                name="loanType"
                                value={formData.loanType}
                                onChange={(e)=> setFormData(prev=>({ ...prev, loanType: e.target.value }))}
                                isInvalid={!!errors.loanType}
                                style={{ 
                                    borderRadius: '10px', 
                                    padding: '12px 16px',
                                    fontSize: '1rem',
                                    border: '2px solid #e9ecef'
                                }}
                            >
                                <option value="">Select Loan Type</option>
                                <option value="Car Loan">Car Loan</option>
                                <option value="Truck Loan">Truck Loan</option>
                                <option value="Motorcycle Loan">Motorcycle Loan</option>
                                <option value="Two Wheeler Loan">Two Wheeler Loan</option>
                                <option value="Commercial Vehicle Loan">Commercial Vehicle Loan</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.loanType || ''}
                            </Form.Control.Feedback>
                        </div>

                        <div className="mb-3">
                            <Form.Label className="form-label text-start d-block fw-semibold mb-2">
                                <i className="fas fa-align-left me-2 text-primary"></i>Description <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={(e)=> setFormData(prev=>({ ...prev, description: e.target.value }))}
                                placeholder="Enter detailed loan description..."
                                isInvalid={!!errors.description}
                                style={{ 
                                    borderRadius: '10px', 
                                    padding: '12px 16px',
                                    fontSize: '1rem',
                                    border: '2px solid #e9ecef',
                                    resize: 'vertical'
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description || ''}
                            </Form.Control.Feedback>
                        </div>

                        <div className="mb-3">
                            <Form.Label className="form-label text-start d-block fw-semibold mb-2">
                                <i className="fas fa-percentage me-2 text-primary"></i>Interest Rate (%) <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="interestRate"
                                value={formData.interestRate}
                                onChange={(e)=> setFormData(prev=>({ ...prev, interestRate: e.target.value }))}
                                placeholder="Enter interest rate (e.g., 8.5)"
                                isInvalid={!!errors.interestRate}
                                style={{ 
                                    borderRadius: '10px', 
                                    padding: '12px 16px',
                                    fontSize: '1rem',
                                    border: '2px solid #e9ecef'
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.interestRate || ''}
                            </Form.Control.Feedback>
                        </div>

                        <div className="mb-4">
                            <Form.Label className="form-label text-start d-block fw-semibold mb-2">
                                <i className="fas fa-rupee-sign me-2 text-primary"></i>Maximum Amount (₹) <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="maximumAmount"
                                value={formData.maximumAmount}
                                onChange={(e)=> setFormData(prev=>({ ...prev, maximumAmount: e.target.value }))}
                                placeholder="Enter maximum loan amount (e.g., 500000)"
                                isInvalid={!!errors.maximumAmount}
                                style={{ 
                                    borderRadius: '10px', 
                                    padding: '12px 16px',
                                    fontSize: '1rem',
                                    border: '2px solid #e9ecef'
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.maximumAmount || ''}
                            </Form.Control.Feedback>
                        </div>

                        <div className="d-flex gap-3 mt-4">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/admin/view-loans')}
                                disabled={loading}
                                className="flex-fill"
                                style={{
                                    borderRadius: '15px',
                                    padding: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-fill"
                                style={{
                                    background: 'linear-gradient(135deg, #1e5fa8, #2196f3)',
                                    border: 'none',
                                    borderRadius: '15px',
                                    padding: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 15px rgba(30, 95, 168, 0.3)'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            className="me-2"
                                        />
                                        {isEditMode ? 'Updating...' : 'Submitting...'}
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane me-2"></i>{isEditMode ? 'Update Loan' : 'Add Loan'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>

                    <Modal
                        show={showSuccessModal}
                        onHide={handleSuccessModalClose}
                        centered
                        backdrop="static"
                    >
                        <Modal.Header>
                            <Modal.Title className="modal-title-custom">
                                Success!
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="modal-body-custom text-center">
                            <div className="text-success mb-3">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                            </div>
                            <p>Loan {isEditMode ? 'updated' : 'added'} successfully.</p>
                        </Modal.Body>
                        <Modal.Footer className="modal-footer-custom">
                            <Button
                                onClick={handleSuccessModalClose}
                                className="btn-confirm"
                            >
                                OK
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal
                        show={showErrorModal}
                        onHide={handleErrorModalClose}
                        centered
                        backdrop="static"
                    >
                        <Modal.Header>
                            <Modal.Title className="modal-title-custom">
                                Error
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="modal-body-custom text-center">
                            <div className="text-danger mb-3">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </div>
                            <p>{errorMessage}</p>
                        </Modal.Body>
                        <Modal.Footer className="modal-footer-custom">
                            <Button
                                onClick={handleErrorModalClose}
                                className="btn-confirm"
                            >
                                OK
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default LoanForm;