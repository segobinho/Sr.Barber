import React from 'react';
import './style.css';


const EditButton = ({ type, onClick, children }) => (
  <button type={type} onClick={onClick} className="edit-button">
    {children}
  </button>
);

export default EditButton;