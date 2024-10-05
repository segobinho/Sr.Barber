import React from 'react';

const CustomToolbar = ({ resource }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img
      src={resource.img}
      alt={resource.title}
      style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
    />
    <span>{resource.title}</span>
  </div>
);

export default CustomToolbar;
