import React from "react";
import './style.css';

function Login () {
    return (
        <div className='login-container'>
            <div className='circle'></div>
            <div className="login-box">
                <label className='email'><strong>Email</strong></label>
                <input type="text" placeholder="Usuário"  />
                <label className='senha'><strong>Senha</strong></label>
                <input type="password" placeholder="Senha" />
                <button type="submit"  className='login-button'>Login</button>
            </div>
        </div>
    );
}

export default Login;
