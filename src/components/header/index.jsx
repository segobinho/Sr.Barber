import React from 'react';
import './style.css';
import Logo from '../../assets/logo.png'

function Header () {
    return (
      <header className='header'>  
        <div className='header-logo'>
            <img src={Logo} alt="logo sr barber" />
        </div>
      </header>  
    )
}

export default Header;