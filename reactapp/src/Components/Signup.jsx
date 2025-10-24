import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Signup.css';
import { useDispatch, useSelector } from 'react-redux';
import { signup, selectIsAuthenticated, selectUserLoading, selectUserRole } from '../redux/slices/userSlice';
import { Eye, EyeOff } from 'lucide-react';
import { VALIDATION_MESSAGES as M } from '../config/messages';

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);


  
  const userRole = useSelector(selectUserRole);
  const loading = useSelector(selectUserLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userRole) {
      const role = (userRole || '').toString().toLowerCase();
      if (role === 'admin') navigate('/admin/home', { replace: true });
      else navigate('/user/home', { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = M.userNameRequired;
    if (!formData.email.trim()) newErrors.email = M.emailRequired;
    else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email))
      newErrors.email = M.emailInvalid;
    if (!formData.mobile.trim()) newErrors.mobile = M.mobileRequired;
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = M.mobileInvalid;
    if (!formData.password) newErrors.password = M.passwordRequired;
    else if (formData.password.length < 6) newErrors.password = M.passwordMinLength;
    if (!formData.confirmPassword) newErrors.confirmPassword = M.confirmPasswordRequired;
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = M.passwordsDoNotMatch;
    if (!formData.role) newErrors.role = M.roleRequired;
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const registrationData = {
      userName: formData.userName,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      role: formData.role,
    };

    try {
      // unwrap() will throw the rejected payload (from rejectWithValue) so we can show it here
      await dispatch(signup(registrationData)).unwrap();
      toast.success('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      // error may be a string (rejectWithValue) or an Error-like object
      const msg = typeof error === 'string' ? error : error?.message || 'Signup failed';
      toast.error(msg);
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2 className="signup-title">Signup</h2>
          <p className="signup-subtitle">Join VehicleLoanHub today</p>
        </div>

        <div className="signup-body">
          <form onSubmit={handleSubmit}>
            {/* form fields (userName, email, mobile, password, confirm, role) */}
            <div className="signup-form-group">
              <label htmlFor="userName" className="signup-form-label">User Name <span className="text-danger">*</span></label>
              <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange}
                placeholder="Enter your username" className={`signup-form-input ${errors.userName ? 'error' : ''}`} disabled={loading} />
              {errors.userName && <span className="signup-error-message">{errors.userName}</span>}
            </div>

            <div className="signup-form-group">
              <label htmlFor="email" className="signup-form-label">Email <span className="text-danger">*</span></label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Enter your email" className={`signup-form-input ${errors.email ? 'error' : ''}`} disabled={loading} />
              {errors.email && <span className="signup-error-message">{errors.email}</span>}
            </div>

            <div className="signup-form-group">
              <label htmlFor="mobile" className="signup-form-label">Mobile Number <span className="text-danger">*</span></label>
              <input type="text" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange}
                placeholder="Enter 10-digit mobile number" className={`signup-form-input ${errors.mobile ? 'error' : ''}`} disabled={loading} maxLength={10} />
              {errors.mobile && <span className="signup-error-message">{errors.mobile}</span>}
            </div>

            <div className="signup-form-group">
              <label htmlFor="password" className="signup-form-label">Password <span className="text-danger">*</span></label>
              <div className="signup-password-wrapper">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password}
                  onChange={handleChange} placeholder="Password" className={`signup-password-input ${errors.password ? 'error' : ''}`} disabled={loading} />
                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} 
                </button>
              </div>
              {errors.password && <span className="signup-error-message">{errors.password}</span>}
            </div>

            <div className="signup-form-group">
              <label htmlFor="confirmPassword" className="signup-form-label">Confirm Password <span className="text-danger">*</span></label>
              <div className="signup-password-wrapper">
                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Confirm Password" className={`signup-password-input ${errors.confirmPassword ? 'error' : ''}`} disabled={loading} />
                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="signup-error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="signup-form-group signup-role-group">
              <label htmlFor="role" className="signup-form-label">Role <span className="text-danger">*</span></label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className={`signup-select ${errors.role ? 'error' : ''}`} disabled={loading}>
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <span className="signup-error-message">{errors.role}</span>}
            </div>

            <button type="submit" className="signup-submit-button" disabled={loading}>
              {loading ? (
                <>
                  <output className="signup-spinner"  aria-hidden="true"></output>Submitting...
                </>
              ) : 'Submit'}
            </button>

            <div className="signup-footer-text">
              Already have an Account? <Link to="/login" className="signup-login-link">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;