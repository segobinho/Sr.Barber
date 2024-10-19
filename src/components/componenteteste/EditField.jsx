import React from 'react';
import './style.css';

const EditField = ({ label, name, value, onChange, type }) => (
  <div className="edit-field">
    <label>{label}</label>
    <input name={name} type={type} value={value} onChange={onChange} />
  </div>
);

export default EditField;
