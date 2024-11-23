import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import UserSelect from './components/UserSelect/UserSelect';
import { Box, ThemeProvider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import theme from './theme';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';

const App = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: '100vh' }}>
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                isAuthenticated ? 
                                <Navigate to="/select-user" replace /> : 
                                <Login />
                            } 
                        />
                        <Route 
                            path="/select-user" 
                            element={
                                isAuthenticated ? 
                                <UserSelect /> : 
                                <Navigate to="/" replace />
                            } 
                        />
                        <Route 
                            path="/dashboard" 
                            element={
                                isAuthenticated ? 
                                <Dashboard /> : 
                                <Navigate to="/" replace />
                            } 
                        />
                    </Routes>
                </AnimatePresence>
            </Box>
        </ThemeProvider>
    );
};

export default App;
