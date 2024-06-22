import React from 'react';
import Logo from '../../assets/logo.png';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>página não foi encontrada</h1>
      <p style={{ color: 'gray' }}>Error code: 404</p>
      <img src={Logo} alt="Erro 404 - Página não encontrada" style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  );
}

export default NotFoundPage;
