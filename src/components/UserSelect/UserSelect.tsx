import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Dialog,
    IconButton,
    InputAdornment,
    Button,
    useTheme,
    alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { login } from '../../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UserSelect = () => {
    const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; role: string; pin: string } | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [pinVisible, setPinVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const users = useSelector((state: RootState) => state.users.users);

    const filteredUsers = users.filter(user => 
        user.active && (
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleUserClick = (user: { id: string; name: string; role: string; pin: string }) => {
        setSelectedUser(user);
        setOpenDialog(true);
        setPin('');
        setError('');
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        setPin('');
        setError('');
    };

    const handlePinSubmit = () => {
        if (selectedUser && pin === selectedUser.pin) {
            dispatch(login({
                id: selectedUser.id,
                name: selectedUser.name,
                role: selectedUser.role
            }));
            navigate('/dashboard');
        } else {
            setError('Incorrect PIN');
            setPin('');
        }
    };

    const getRandomColor = (name: string) => {
        const colors = [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            '#00bcd4',
            '#009688',
            '#4caf50',
            '#8bc34a',
            '#cddc39',
            '#ff9800',
            '#ff5722',
        ];
        return colors[name.length % colors.length];
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#f8fafc',
                position: 'relative',
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: `linear-gradient(to bottom right, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                    clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)',
                    zIndex: 0,
                }}
            />

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 1,
                    px: { xs: 2, sm: 4, md: 6 },
                    py: 4,
                }}
            >
                {/* Header */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 800,
                            mb: 1,
                            color: theme.palette.text.primary,
                        }}
                    >
                        Select User
                    </Typography>
                    <Typography 
                        sx={{ 
                            color: theme.palette.text.secondary,
                            mb: 4,
                            fontSize: '1.1rem',
                        }}
                    >
                        Choose your profile to continue
                    </Typography>

                    {/* Search Bar */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            placeholder="Search by name or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            sx={{
                                maxWidth: 400,
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        boxShadow: '0 3px 6px rgba(0,0,0,0.12)',
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>

                {/* Content Container */}
                <Box
                    sx={{
                        maxWidth: 1200,
                        width: '100%',
                        mx: 'auto',
                        flex: 1,
                    }}
                >
                    {/* User Grid */}
                    <Box 
                        sx={{ 
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                            gap: 3,
                        }}
                    >
                        <AnimatePresence>
                            {filteredUsers.map((user, index) => {
                                const color = getRandomColor(user.name);
                                return (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <Box
                                            onClick={() => handleUserClick(user)}
                                            sx={{
                                                bgcolor: 'white',
                                                borderRadius: 3,
                                                p: 3,
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 20px ${alpha(color, 0.2)}`,
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: '20px',
                                                    bgcolor: alpha(color, 0.1),
                                                    color: color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 700,
                                                    mb: 2,
                                                }}
                                            >
                                                {user.name[0]}
                                            </Box>

                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    mb: 0.5,
                                                    fontSize: '1rem',
                                                }}
                                            >
                                                {user.name}
                                            </Typography>

                                            <Typography 
                                                variant="body2"
                                                sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    bgcolor: alpha(color, 0.1),
                                                    color: color,
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {user.role}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </Box>
                </Box>

                {/* PIN Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleClose}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', p: 3 }}>
                        <IconButton
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: 'text.secondary',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {selectedUser && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box sx={{ textAlign: 'center', mb: 4 }}>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '24px',
                                            bgcolor: alpha(getRandomColor(selectedUser.name), 0.1),
                                            color: getRandomColor(selectedUser.name),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            mx: 'auto',
                                            mb: 2,
                                        }}
                                    >
                                        {selectedUser.name[0]}
                                    </Box>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                        {selectedUser.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedUser.role}
                                    </Typography>
                                </Box>

                                <TextField
                                    fullWidth
                                    type={pinVisible ? 'text' : 'password'}
                                    placeholder="Enter PIN"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    error={!!error}
                                    helperText={error}
                                    autoFocus
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setPinVisible(!pinVisible)}>
                                                    {pinVisible ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && pin) {
                                            handlePinSubmit();
                                        }
                                    }}
                                />

                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Button 
                                        onClick={handleClose}
                                        sx={{ 
                                            color: 'text.secondary',
                                            '&:hover': { bgcolor: 'action.hover' },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handlePinSubmit}
                                        disabled={!pin}
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                        }}
                                    >
                                        Continue
                                    </Button>
                                </Box>
                            </motion.div>
                        )}
                    </Box>
                </Dialog>
            </Box>
        </Box>
    );
};

export default UserSelect;