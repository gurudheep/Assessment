import '../../styles/DeleteConfirmation.css';
function DeleteConfirmation({ onConfirm, onCancel }) {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <div className="delete-modal-header">
          <h2>Confirm Delete</h2>
        </div>
        
        <div className="delete-modal-body">
          <p>Are you sure you want to delete this student?</p>
          <p className="warning-text">This action cannot be undone.</p>
        </div>
        
        <div className="delete-modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;