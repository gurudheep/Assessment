import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentList from '../components/StudentList';
import StudentForm from '../components/StudentForm';
import DeleteConfirmation from '../components/DeleteConfirmation';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Dashboard.css';

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, studentId: null });
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Initial mock data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const savedStudents = localStorage.getItem('students');
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      } else {
        const mockStudents = [
          { id: 1, name: 'John Doe', email: 'john@example.com', age: 20 },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 22 },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 21 },
        ];
        setStudents(mockStudents);
        localStorage.setItem('students', JSON.stringify(mockStudents));
      }
      setLoading(false);
    }, 1000);
  }, []);

  // Save students to localStorage whenever they change
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students]);

  const handleAddStudent = (studentData) => {
    setLoading(true);
    setTimeout(() => {
      const newStudent = {
        ...studentData,
        id: Date.now(),
      };
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      setShowForm(false);
      setLoading(false);
    }, 500);
  };

  const handleUpdateStudent = (studentData) => {
    setLoading(true);
    setTimeout(() => {
      const updatedStudents = students.map(s => 
        s.id === editingStudent.id ? { ...studentData, id: s.id } : s
      );
      setStudents(updatedStudents);
      setEditingStudent(null);
      setShowForm(false);
      setLoading(false);
    }, 500);
  };

  const handleDeleteStudent = () => {
    setLoading(true);
    setTimeout(() => {
      const updatedStudents = students.filter(s => s.id !== deleteDialog.studentId);
      setStudents(updatedStudents);
      setDeleteDialog({ show: false, studentId: null });
      setLoading(false);
    }, 500);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteDialog({ show: true, studentId: id });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter students based on search text
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(filterText.toLowerCase()) ||
    student.email.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>StudentMS</h2>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            ×
          </button>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <span className="icon">📊</span>
              Dashboard
            </li>
            <li>
              <span className="icon">👥</span>
              Students
            </li>
            <li>
              <span className="icon">⚙️</span>
              Settings
            </li>
          </ul>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <span className="icon">🚪</span>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1>Student Management Dashboard</h1>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add Student
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <h3>Total Students</h3>
                <p>{students.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-details">
                <h3>Average Age</h3>
                <p>
                  {students.length > 0
                    ? Math.round(students.reduce((acc, s) => acc + s.age, 0) / students.length)
                    : 0}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📧</div>
              <div className="stat-details">
                <h3>Active Emails</h3>
                <p>{students.length}</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Student List */}
          {loading && <LoadingSpinner />}
          
          {showForm && (
            <StudentForm
              student={editingStudent}
              onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
              onClose={handleCloseForm}
            />
          )}

          {deleteDialog.show && (
            <DeleteConfirmation
              onConfirm={handleDeleteStudent}
              onCancel={() => setDeleteDialog({ show: false, studentId: null })}
            />
          )}

          <StudentList
            students={filteredStudents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            filterText={filterText}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;