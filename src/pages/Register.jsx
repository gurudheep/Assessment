import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear register error when user starts typing
    setRegisterError('');
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
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        navigate('/dashboard');
      } catch (error) {
        setRegisterError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 20, label: 'Weak', class: 'weak' };
    if (strength <= 4) return { strength: 60, label: 'Medium', class: 'medium' };
    return { strength: 100, label: 'Strong', class: 'strong' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="register-container">
      {loading && <LoadingSpinner />}
      
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Sign up to manage students</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {registerError && (
            <div className="error-alert">
              {registerError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.name && errors.name ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {touched.name && errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

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
              placeholder="Create a password"
            />
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className={`strength-fill ${passwordStrength.class}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
                <span className={`strength-label ${passwordStrength.class}`}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="password-requirements">
            <p>Password must contain:</p>
            <ul>
              <li className={formData.password.length >= 6 ? 'met' : ''}>
                At least 6 characters
              </li>
              <li className={/[a-z]/.test(formData.password) ? 'met' : ''}>
                One lowercase letter
              </li>
              <li className={/[A-Z]/.test(formData.password) ? 'met' : ''}>
                One uppercase letter
              </li>
              <li className={/[0-9]/.test(formData.password) ? 'met' : ''}>
                One number
              </li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;