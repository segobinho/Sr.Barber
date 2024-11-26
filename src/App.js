import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Receba from './pages/index'
import ProtectedRoutes from './utils/ProtectedRoutes/index';
import Home from './pages/Home';
import Agendamentos from './pages/Agendamentos';
import Analise from './pages/Analise';
import Clientes from './pages/Clientes';
import Funcionarios from './pages/Funcionarios';
import Produtos from './pages/Produtos';
import NotFound from './pages/NotFound';
import Barbearias from './pages/barbearias/index';
import Checkout from './pages/chekout';
import Configuracoes from './pages/configuracoes';





function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route element={<ProtectedRoutes allowedRoles={['admin', 'gerente', 'Gerente']} />}>
        <Route path='/Receba' element={<Receba />}></Route>
        <Route path='/Analise' element={<Analise />}></Route>
        <Route path='/Funcionarios' element={<Funcionarios />}></Route>
        </Route>
        <Route element={<ProtectedRoutes allowedRoles={['admin', 'usuario', 'gerente', 'Gerente', 'Recepcionista', 'Barbeiro']} />}>
        <Route path='/Clientes' element={<Clientes />}></Route>
        <Route path='/Agendamentos' element={<Agendamentos />}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/Produtos' element={<Produtos/>}></Route>
        <Route path='/check' element={<Checkout />}></Route>
        <Route path='/config' element={<Configuracoes />}></Route>

        </Route>
        <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>
        <Route path='/Barbearias' element={<Barbearias/>}></Route>

        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>


  );
}

export default App;
