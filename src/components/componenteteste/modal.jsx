import React from 'react';
import './style.css';

const Modal = ({ onClose, children }) => {
  return (
    <>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal">
        <button className="close-button" onClick={onClose}>×</button>
        {children}
      </div>
    </>
  );
};

export default Modal;
