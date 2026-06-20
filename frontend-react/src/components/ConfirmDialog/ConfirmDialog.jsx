import React from 'react';
import Modal from '../Modal/Modal';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = "CONFIRM_ACTION", message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirm-dialog-content">
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            CANCEL
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            CONFIRM
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
