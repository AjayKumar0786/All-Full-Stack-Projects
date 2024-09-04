import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupForm from './SignupForm';
import AllUsers from './components/AllUsers';
import Dashboard from './dashboard';
import ProtectedRoutes from './utils/protectedRoutes';
import LoginForm from './LoginForm';

const App = () => {
    return (

        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/SignupForm" element={<SignupForm />} />

            <Route element={<ProtectedRoutes />}>
                <Route path="/allusers" element={<AllUsers />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        </Routes>


    );
};

export default App;
