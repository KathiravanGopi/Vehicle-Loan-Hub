import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetPassword, clearError } from '../redux/slices/userSlice';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgotPassword.css';
import './Login.css';
import { Eye, EyeOff } from 'lucide-react';
import { VALIDATION_MESSAGES as M } from '../config/messages';
import CustomModal from './CustomModal';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isVerified, setIsVerified] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resetting, setResetting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.user);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      setModalMessage(error);
      setShowErrorModal(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Verify email
  const handleVerifyEmail = async (email) => {
    setVerifying(true);
    try {
      await dispatch(forgotPassword(email)).unwrap();
      setIsVerified(true);
      setErrors({});
    } catch (err) {
      setErrors({ email: err });
      setIsVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  // Reset password
  const handleResetPassword = async (data) => {
    setResetting(true);
    try {
      await dispatch(resetPassword(data)).unwrap();
      setFormData({ email: '', newPassword: '', confirmPassword: '' });
      setIsVerified(false);
      setModalMessage('Password reset successful! Redirecting to login...');
      setShowSuccessModal(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErrors({ submit: err });
      setModalMessage(err);
      setShowErrorModal(true);
    } finally {
      setResetting(false);
    }
  };

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = M.emailRequired;
    else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email))
      newErrors.email = M.emailInvalid;

    if (!formData.newPassword) newErrors.newPassword = M.newPasswordRequired;
    else if (formData.newPassword.length < 6) newErrors.newPassword = M.passwordMinLength;

    if (!formData.confirmPassword) newErrors.confirmPassword = M.confirmPasswordRequired;
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = M.passwordsDoNotMatch;

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleVerify = () => {
    setErrors({});
    if (!formData.email.trim()) return setErrors({ email: M.emailRequired });
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email))
      return setErrors({ email: M.emailInvalid });

    handleVerifyEmail(formData.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);
    if (!isVerified) return setErrors({ email: M.verifyEmailFirst });

    handleResetPassword({ email: formData.email, newPassword: formData.newPassword });
  };

  // Extracted verify button text logic
  let verifyButtonText;
  if (verifying) verifyButtonText = 'Verifying...';
  else if (isVerified) verifyButtonText = 'Verified ✓';
  else verifyButtonText = 'Verify';

  const submitButtonText = resetting ? 'Resetting Password...' : 'Reset Password';

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h2 className="forgot-password-title">Forgot Password</h2>
          <p className="forgot-password-subtitle">Enter your email to reset your password.</p>
        </div>

        <div className="forgot-password-body">
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className={`form-input ${errors.email ? 'error' : ''}`}
                disabled={isVerified || verifying || resetting}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={handleVerify}
              className={`verify-button ${isVerified ? 'verified' : ''}`}
              disabled={isVerified || verifying || resetting}
            >
              {verifyButtonText}
            </button>

            {/* Password Fields */}
            <PasswordField
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              show={showNewPassword}
              toggleShow={() => setShowNewPassword((s) => !s)}
              onChange={handleChange}
              error={errors.newPassword}
              disabled={!isVerified || verifying || resetting}
            />
            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              show={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword((s) => !s)}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={!isVerified || verifying || resetting}
            />

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <button type="submit" className="submit-button" disabled={!isVerified || verifying || resetting}>
              {submitButtonText}
            </button>

            <div className="footer-text">
              Remembered your password? <Link to="/login" className="link">Login</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <CustomModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title="Success!"
        body={modalMessage}
        singleButton
      />

      {/* Error Modal */}
      <CustomModal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        title="Error"
        body={modalMessage}
        singleButton
      />
    </div>
  );
};

// PasswordField Component with PropTypes
const PasswordField = ({ label, name, value, show, toggleShow, onChange, error, disabled }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label} <span className="text-danger">*</span>
    </label>
    <div className="login-password-wrapper">
      <input
        type={show ? 'text' : 'password'}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className={`form-input login-password-input ${error ? 'error' : ''}`}
        disabled={disabled}
      />
      <button
        type="button"
        className="login-password-toggle"
        onClick={toggleShow}
        disabled={disabled}
        aria-label={show ? 'Hide password' : 'Show password'}
        title={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && <div className="error-message">{error}</div>}
  </div>
);

PasswordField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  toggleShow: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ForgotPassword;
