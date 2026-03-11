import { useState, useEffect } from 'react';
import '../styles/StudentForm.css';

function StudentForm({ student, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        age: student.age
      });
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age between 1 and 120';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
      // Mark all fields as touched to show errors
      setTouched({
        name: true,
        email: true,
        age: true
      });
    }
  };

  // Update errors when form data changes
  useEffect(() => {
    setErrors(validateForm());
  }, [formData]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.name && errors.name ? 'error' : ''}
              placeholder="Enter student name"
            />
            {touched.name && errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? 'error' : ''}
              placeholder="Enter email address"
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="age">Age *</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.age && errors.age ? 'error' : ''}
              placeholder="Enter age"
              min="1"
              max="120"
            />
            {touched.age && errors.age && (
              <span className="error-message">{errors.age}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {student ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;