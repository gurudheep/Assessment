import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear login error when user starts typing
    setLoginError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } catch (error) {
        setLoginError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      {loading && <LoadingSpinner />}
      
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {loginError && (
            <div className="error-alert">
              {loginError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.password && errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Create Account
            </Link>
          </p>
        </div>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <p>Email: john@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;