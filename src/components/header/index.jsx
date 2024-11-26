import React from 'react';
import './style.css';
import Logo from '../../assets/logo.png';
import { FaGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';  // Importar useNavigate~
import LogoutIcon from '@mui/icons-material/Logout';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();  // Usar useNavigate para navegação programática

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Limpar informações de usuário do localStorage
    navigate('/'); // Redirecionar para a página de login ou outra página inicial
  };

  return (
    <header className='header'>
      <div className='header-logo'>
        {user && (user.cargo === 'admin' || user.cargo === 'Gerente' || user.cargo === 'Barbeiro' || user.cargo === 'Recepcionista') && (
          <img onClick={() => handleNavigate('/Home')} src={Logo} alt="logo sr barber" />
        )}
      </div>
      <div className='lista'>
        <ul>
          {user && (user.cargo === 'admin' || user.cargo === 'Gerente') && (
            <li onClick={() => handleNavigate('/receba')}>Serviço</li>
          )}

          {user && (user.cargo === 'admin' || user.cargo === 'Gerente') && (
            <li onClick={() => handleNavigate('/Funcionarios')}>Funcionário</li>
          )}

          {user && (user.cargo === 'admin' || user.cargo === 'Gerente' || user.cargo === 'Barbeiro' || user.cargo === 'Recepcionista') && (
            <li onClick={() => handleNavigate('/Clientes')}>Clientes</li>
          )}
          {user && (user.cargo === 'admin' || user.cargo === 'erente' || user.cargo === 'Barbeiro' || user.cargo === 'Recepcionista') && (
            <li onClick={() => handleNavigate('/Agendamentos')}>Agendamento</li>
          )}

          {user && (user.cargo === 'admin' || user.cargo === 'Gerente' || user.cargo === 'Recepcionista') && (
            <li onClick={() => handleNavigate('/Produtos')}>Produtos</li>
          )}

          {user && (user.cargo === 'admin') && (
            <li onClick={() => handleNavigate('/Analise')}>Gráficos</li>
          )}

          {user && (user.cargo === 'admin') && (
            <li onClick={() => handleNavigate('/Barbearias')}>Barbearias</li>
          )}

          {user && (user.cargo === 'admin' || user.cargo === 'Gerente' || user.cargo === 'Barbeiro' || user.cargo === 'Recepcionista') && (
            <li onClick={() => handleNavigate('/check')}>Compras</li>
          )}






        </ul>
      </div>
      <div className='config-container'>
        <div className='cargoheader'><p>{user.cargo}</p></div>
        <div className='vertical-line'></div>

        <LogoutIcon
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
          className="logout-icon"
        />
        <i className="gear" onClick={() => handleNavigate('/config')}><FaGear /></i>        </div>
    </header>
  );
}

export default Header;
