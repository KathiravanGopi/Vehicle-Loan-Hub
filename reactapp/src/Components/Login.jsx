import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectIsAuthenticated, selectUserRole, selectUserLoading } from '../redux/slices/userSlice';
import { Eye, EyeOff } from 'lucide-react';
import { VALIDATION_MESSAGES as M } from '../config/messages';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const loading = useSelector(selectUserLoading);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && userRole) {
      const role = (userRole || '').toString().toLowerCase();
      if (role === 'admin') {
        navigate('/admin/home', { replace: true });
      } else {
        navigate('/user/home', { replace: true });
      }
    }
  }, [isAuthenticated, userRole, navigate]);


  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = M.emailRequired;
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = M.emailInvalid;
    }

    if (!formData.password.trim()) {
      newErrors.password = M.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = M.passwordMinLength;
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // unwrap will throw the rejected payload so we can show the server message here
      await dispatch(login(formData)).unwrap();
      toast.success('Login successful!');
    } catch (error) {
      console.log(error);
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Login failed';
      toast.error(errorMessage)
      console.error('Login error:', errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Side - Brand Section */}
        <div className="login-brand-section">
          <div className="login-brand-content">
              <h2 className="login-brand-title">
              VehicleVault
              </h2>
            <p className="login-brand-description">
              Financial success is a journey, and the first step is applying for the loan
            </p>
          </div>
          
          {/* Decorative circles */}
          <div className="decorative-circle-top"></div>
          <div className="decorative-circle-bottom"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <h2 className="login-form-title">
              Login
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="login-form-group">
                <label htmlFor="email" className="login-form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`login-form-input ${errors.email ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.email && (
                  <span className="login-error-message">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="login-form-group">
                <label htmlFor="password" className="login-form-label">
                  Password
                </label>
                <div className="login-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`login-password-input ${errors.password ? 'error' : ''}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="login-error-message">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="login-forgot-password">
                <Link to="/forgot-password" className="login-forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="login-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <output className="login-spinner"  aria-hidden="true"></output>Logging in...
                  </>
                ) : 'Login'}
              </button>

              <div className="login-footer-text">
                Don't have an account?{' '}
                <Link to="/signup" className="login-signup-link">
                  Signup
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;