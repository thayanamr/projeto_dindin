import './style.css';
import { useState } from 'react';
import { Route, Routes, Outlet, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp/index';
import Login from './pages/Login/index.jsx';
import Home from './pages/home/index';


function ProtectedRoutes({ redirectTo }) {

    const isAuthenticated = localStorage.getItem('autorize');//Troca depois para autorize

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />
}

export default function Rotas() {
    const [conta, setConta] = useState(false);


    return (
        <Routes>
            <Route path='/' element={<Login setConta={setConta} />} />
            <Route path='/cadastrar' element={<SignUp />} />
            <Route element={<ProtectedRoutes redirectTo="/" />}>
                <Route path='/home' element={<Home conta={conta} />} />
            </Route>
        </Routes>
    );
}
