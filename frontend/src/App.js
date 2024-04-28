import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from 'components/LoginForm';
import RegisterForm from 'components/RegisterForm';

import Main from 'components/Main';
import { AuthProvider } from 'hooks/AuthContext';


function App() {


    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/" element={<Main />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
