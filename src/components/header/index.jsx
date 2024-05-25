import React from 'react';
import './style.css';
import Logo from '../../assets/logo.png'
import { FaGear } from "react-icons/fa6";

function Header () {
    return (
      <header className='header'>  
        <div className='header-logo'>
            <img src={Logo} alt="logo sr barber" />
        </div>
        <div className='lista'>
          <ul>
            <li>Serviço</li>
            <li>Funcionário</li>
            <li>Clientes</li>
            <li>Agendamento</li>
            <li>Produtos</li>
            <li>Gráficos</li>
          </ul>
        </div>
        <div className='config-container'>
                <div className='vertical-line'></div>
                <i className="gear"> <FaGear /></i> 
            </div>
      </header>  
    )
}

export default Header;