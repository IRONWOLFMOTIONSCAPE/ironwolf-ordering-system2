import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Alert,
    Snackbar,
    useTheme,
    Fade,
    CircularProgress,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Lock as LockIcon,
    Person as PersonIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import { GlossyButton } from '../../styles/components';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../common/PageTransition';
import { keyframes } from '@emotion/react';

const gradientAnimation = keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
`;

const fadeIn = keyframes`
    0% {
        opacity: 0;
        transform: translateY(-20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;

const slideIn = keyframes`
    0% {
        opacity: 0;
        transform: translateX(-20px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
`;

const successAnimation = keyframes`
    0% {
        opacity: 0;
        transform: translate(-50%, -100%);
    }
    50% {
        opacity: 1;
        transform: translate(-50%, 10%);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, 0);
    }
`;

const exitAnimation = keyframes`
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(1.2);
        opacity: 0;
    }
`;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulated authentication
        if (username === 'admin' && password === 'admin123') {
            setTimeout(() => {
                dispatch(login({
                    id: '1',
                    name: 'Admin',
                    role: 'Manager'
                }));
                setIsLoading(false);
                setShowSuccess(true);
                
                // Navigate to user selection after successful login
                setTimeout(() => {
                    navigate('/select-user');
                }, 1000);
            }, 1500);
        } else {
            setTimeout(() => {
                setError('Invalid username or password');
                setIsLoading(false);
            }, 1500);
        }
    };

    return (
        <PageTransition isExiting={false}>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(-45deg, 
                        ${theme.palette.primary.dark} 0%,
                        ${theme.palette.primary.main} 25%,
                        ${theme.palette.secondary.dark} 51%,
                        ${theme.palette.primary.dark} 100%)`,
                    backgroundSize: '400% 400%',
                    animation: `${gradientAnimation} 15s ease infinite`,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.1)',
                        zIndex: 0,
                    }
                }}
            >
                {/* Abstract Pattern Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.4,
                        background: `radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                        zIndex: 0,
                    }}
                />

                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 2,
                                backdropFilter: 'blur(20px)',
                                background: 'rgba(255, 255, 255, 0.85)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        background: theme.palette.primary.main,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                        animation: `${fadeIn} 0.6s ease-out`,
                                    }}
                                >
                                    <LockIcon sx={{ fontSize: 40, color: 'white' }} />
                                </Box>
                                <Typography 
                                    variant="h4" 
                                    gutterBottom 
                                    fontWeight={700}
                                    sx={{ 
                                        animation: `${fadeIn} 0.6s ease-out`,
                                        animationDelay: '0.2s',
                                        animationFillMode: 'both',
                                    }}
                                >
                                    Welcome Back!
                                </Typography>
                                <Typography 
                                    variant="h5" 
                                    gutterBottom 
                                    fontWeight={600}
                                    sx={{ 
                                        animation: `${fadeIn} 0.6s ease-out`,
                                        animationDelay: '0.3s',
                                        animationFillMode: 'both',
                                        color: theme.palette.primary.main,
                                    }}
                                >
                                    IRONWOLF
                                </Typography>
                                <Typography 
                                    variant="subtitle1" 
                                    color="text.secondary" 
                                    gutterBottom
                                    sx={{ 
                                        animation: `${slideIn} 0.6s ease-out`,
                                        animationDelay: '0.4s',
                                        animationFillMode: 'both',
                                    }}
                                >
                                    Digital Printing Management System
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ 
                                        animation: `${slideIn} 0.6s ease-out`,
                                        animationDelay: '0.5s',
                                        animationFillMode: 'both',
                                        mt: 1,
                                    }}
                                >
                                    Please sign in to continue to your dashboard
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handleSubmit} autoComplete="off" noValidate>
                                <TextField
                                    fullWidth
                                    required
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    autoComplete="off"
                                    inputProps={{
                                        autoComplete: 'off',
                                        form: {
                                            autoComplete: 'off',
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: theme.palette.primary.main }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#fff',
                                                boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: theme.palette.text.secondary,
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    required
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="new-password"
                                    inputProps={{
                                        autoComplete: 'new-password',
                                        form: {
                                            autoComplete: 'off',
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: theme.palette.primary.main }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{
                                                        color: theme.palette.primary.main,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#fff',
                                                boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: theme.palette.text.secondary,
                                        },
                                    }}
                                />

                                <Box sx={{ mt: 3 }}>
                                    <GlossyButton
                                        type="submit"
                                        disabled={isLoading}
                                        sx={{
                                            position: 'relative',
                                            height: 48,
                                        }}
                                    >
                                        {isLoading ? (
                                            <CircularProgress size={24} sx={{ color: 'white' }} />
                                        ) : (
                                            'Login'
                                        )}
                                    </GlossyButton>
                                </Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    align="center"
                                    sx={{ display: 'block', mt: 2 }}
                                >
                                    {new Date().getFullYear()} IronWolf Digital Printing. All rights reserved.
                                </Typography>
                            </Box>
                        </Paper>
                    </motion.div>
                </Container>

                <AnimatePresence>
                    {showSuccess && (
                        <Box
                            sx={{
                                position: 'fixed',
                                top: 20,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 9999,
                                animation: `${successAnimation} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                            }}
                        >
                            <Alert
                                icon={<CheckCircleOutlineIcon sx={{ fontSize: 28 }} />}
                                severity="success"
                                variant="filled"
                                sx={{
                                    minWidth: '300px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                                    padding: '16px 24px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    transform: 'translateY(0)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                                    },
                                    '& .MuiAlert-icon': {
                                        fontSize: '1.75rem',
                                        padding: '4px 0',
                                    },
                                    '& .MuiAlert-message': {
                                        fontSize: '1.1rem',
                                        fontWeight: 500,
                                        padding: '4px 0',
                                    },
                                    backgroundColor: theme.palette.success.main,
                                }}
                            >
                                Login Successful! Redirecting...
                            </Alert>
                        </Box>
                    )}
                </AnimatePresence>

                <Snackbar
                    open={!!error}
                    autoHideDuration={4000}
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    TransitionComponent={Fade}
                >
                    <Alert
                        severity="error"
                        variant="filled"
                        onClose={() => setError('')}
                        sx={{
                            minWidth: '300px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            borderRadius: '12px',
                            '& .MuiAlert-message': {
                                fontSize: '1rem',
                                fontWeight: 500,
                            },
                        }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </PageTransition>
    );
};

export default Login;
