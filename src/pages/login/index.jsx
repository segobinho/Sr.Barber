import React, { useState } from "react";
import './stylelogin.css';
import Validation from '../../hooks/LoginValidation';  
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        
        // Aguarda a validação antes de continuar
        if (Object.keys(errors).length === 0) {
            axios.post('http://localhost:8800/login', values)
            .then(res => {
                if(res.data.status === "Sucesso") {
                    // Armazena o email e o cargo do usuário no localStorage
                    localStorage.setItem('user', JSON.stringify({ email: values.email, cargo: res.data.cargo,  id_barbearia: res.data.id_barbearia}));

                    navigate('/Home');
                } else {
                    alert("No record existed");
                    window.location.reload();

                    
                }
            })
            .catch(err => console.log(err));
        }
    };
    
    return (
        <div className="LoginImage">
        <div className='login-container'>
            <form onSubmit={handleSubmit}>
                <div className="login-box">
                    <input type="text" className="loginInput" placeholder="Usuário" name='email'
                    onChange={handleInput} />
                    {errors.email && <span className="">{errors.email}</span>}
                    
                    <label className='senha'></label>
                    <input type="password" placeholder="Senha" 
                    name='password' className="loginInput" onChange={handleInput} />
                    {errors.password && <span className="">{errors.password}</span>}
                    
                    <button type="submit" className='login-button'>Login</button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default Login;
