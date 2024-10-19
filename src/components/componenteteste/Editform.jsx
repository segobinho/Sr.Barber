import React from 'react';
import './style.css';

const EditForm = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="edit-form">
      {children}
    </form>
  );
};

export default EditForm;