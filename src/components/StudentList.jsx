import { useState } from 'react';
import { exportToExcel } from '../utils/excelExport';
import '../styles/StudentList.css';

function StudentList({ students, onEdit, onDelete, filterText }) {
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = () => {
    setExportLoading(true);
    setTimeout(() => {
      exportToExcel(students, `students_${new Date().toISOString().split('T')[0]}`);
      setExportLoading(false);
    }, 500);
  };

  const handleExportFiltered = () => {
    setExportLoading(true);
    setTimeout(() => {
      exportToExcel(students, `filtered_students_${new Date().toISOString().split('T')[0]}`);
      setExportLoading(false);
    }, 500);
  };

  return (
    <div className="student-list-container">
      <div className="list-header">
        <h2>Students List ({students.length})</h2>
        <div className="export-buttons">
          <button 
            className="btn btn-export" 
            onClick={handleExport}
            disabled={exportLoading || students.length === 0}
          >
            {exportLoading ? 'Exporting...' : 'Export All'}
          </button>
          <button 
            className="btn btn-export" 
            onClick={handleExportFiltered}
            disabled={exportLoading || students.length === 0}
          >
            {exportLoading ? 'Exporting...' : 'Export Filtered'}
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <p>No students found. {filterText ? 'Try a different search term.' : 'Add a new student to get started.'}</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(student)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(student.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentList;