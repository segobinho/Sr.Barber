import React from 'react';
import './style.css';
import Logo from '../../assets/logo.png';
import { FaGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';  // Importar useNavigate

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
        {user && (user.cargo === 'admin' || user.cargo === 'gerente'|| user.cargo === 'usuario') && (
            <img onClick={() => handleNavigate('/Home')} src={Logo} alt="logo sr barber" />
          )}
        </div>
        <div className='lista'>
          <ul>
            {user && (user.cargo === 'admin' || user.cargo === 'gerente') && (
              <li onClick={() => handleNavigate('/receba')}>Serviço</li>
            )}

             {user && (user.cargo === 'admin' || user.cargo === 'gerente') && (
            <li onClick={() => handleNavigate('/Funcionarios')}>Funcionário</li>
          )}

          {user && (user.cargo === 'admin' || user.cargo === 'gerente'|| user.cargo === 'usuario' ) && (
            <li onClick={() => handleNavigate('/Clientes')}>Clientes</li>
          )}
          {user && (user.cargo === 'admin' || user.cargo === 'gerente'|| user.cargo === 'usuario' ) && (
            <li  onClick={() => handleNavigate('/Agendamentos')}>Agendamento</li>
          )}

          {user && (user.cargo === 'admin' || user.cargo === 'gerente'|| user.cargo === 'usuario' ) && (
            <li onClick={() => handleNavigate('/Produtos')}>Produtos</li>
          )}

          {user && (user.cargo === 'admin' || user.cargo === 'gerente') && (
            <li  onClick={() => handleNavigate('/Analise')}>Gráficos</li>
          )}

{user && (user.cargo === 'admin' ) && (
            <li  onClick={() => handleNavigate('/Barbearias')}>Barbearias</li>
          )}



          </ul>
        </div>
        <div className='config-container'>
          <div className='cargoheader'><p>{user.cargo}</p></div>
          <div className='vertical-line'></div>
          <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Botão de Logout */}
          <i className="gear" onClick={() => handleNavigate('/config')}><FaGear /></i>        </div>
      </header>  
    );
}

export default Header;
