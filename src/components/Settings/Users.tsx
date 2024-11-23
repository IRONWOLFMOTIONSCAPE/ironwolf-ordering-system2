import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Alert,
    Snackbar,
    Card,
    CardContent,
    Divider,
    Chip,
    useTheme,
    alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector, useDispatch } from 'react-redux';
import { AppRootState } from '../../app/store';
import { addUser, updateUser, toggleUserActive, User } from '../../features/users/usersSlice';

// Deactivation reasons
const deactivationReasons = [
    'End of Employment',
    'Leave of Absence',
    'Account Security',
    'Policy Violation',
    'System Maintenance',
    'Role Change',
    'Other'
];

const ADMIN_PASSWORD = 'ARISUGAWA';

const Users = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const users = useSelector((state: AppRootState) => state.users.users);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [password, setPassword] = useState('');
    const [deactivationReason, setDeactivationReason] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        pin: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleOpenDialog = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                role: user.role,
                pin: user.pin,
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                role: '',
                pin: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingUser(null);
        setFormData({
            name: '',
            role: '',
            pin: ''
        });
    };

    const handleDeactivateClick = (userId: string, isActive: boolean) => {
        console.log('Deactivate clicked for user:', userId, 'Currently active:', isActive);
        setSelectedUserId(userId);
        setPassword('');
        if (!isActive) {
            handleReactivate(userId);
        } else {
            setOpenDeactivateDialog(true);
            setDeactivationReason('');
        }
    };

    const handleReactivate = (userId: string) => {
        setOpenPasswordDialog(true);
        setSelectedUserId(userId);
    };

    const handlePasswordSubmit = () => {
        console.log('Password submitted:', password === ADMIN_PASSWORD ? 'correct' : 'incorrect');
        console.log('Selected user:', selectedUserId);
        
        if (password === ADMIN_PASSWORD) {
            const user = users.find(u => u.id === selectedUserId);
            if (user) {
                if (!user.active) {
                    dispatch(toggleUserActive({ 
                        id: selectedUserId, 
                        active: true,
                        reason: '' 
                    }));
                    setSnackbar({
                        open: true,
                        message: 'User reactivated successfully',
                        severity: 'success'
                    });
                } else {
                    dispatch(toggleUserActive({ 
                        id: selectedUserId, 
                        active: false, 
                        reason: deactivationReason 
                    }));
                    setSnackbar({
                        open: true,
                        message: 'User deactivated successfully',
                        severity: 'success'
                    });
                }
            }
            
            setOpenDeactivateDialog(false);
            setOpenPasswordDialog(false);
            setPassword('');
            setSelectedUserId('');
            setDeactivationReason('');
        } else {
            setSnackbar({
                open: true,
                message: 'Incorrect admin password',
                severity: 'error'
            });
        }
    };

    const handleDeactivateSubmit = () => {
        console.log('Deactivate submit clicked, reason:', deactivationReason);
        if (!deactivationReason) {
            setSnackbar({
                open: true,
                message: 'Please select a reason for deactivation',
                severity: 'error'
            });
            return;
        }
        setOpenDeactivateDialog(false);
        setOpenPasswordDialog(true);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.role || !formData.pin) {
            setSnackbar({
                open: true,
                message: 'Please fill in all fields',
                severity: 'error'
            });
            return;
        }

        if (editingUser) {
            dispatch(updateUser({
                id: editingUser.id,
                ...formData,
                active: editingUser.active,
                reason: editingUser.reason || ''
            }));
            setSnackbar({
                open: true,
                message: 'User updated successfully',
                severity: 'success'
            });
        } else {
            dispatch(addUser({ ...formData, active: true, reason: '' }));
            setSnackbar({
                open: true,
                message: 'User added successfully',
                severity: 'success'
            });
        }
        handleCloseDialog();
    };

    const activeUsers = users.filter(user => user.active);
    const inactiveUsers = users.filter(user => !user.active);

    return (
        <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f8faff',
            overflow: 'auto',
            p: 3,
            gap: 3
        }}>
            {/* Header Section with Asymmetric Design */}
            <Box sx={{
                width: '100%',
                bgcolor: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.04)',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: '40%',
                    height: '200%',
                    background: `linear-gradient(135deg, ${alpha('#2962ff', 0.08)}, ${alpha('#2962ff', 0.03)})`,
                    transform: 'rotate(-15deg)',
                    zIndex: 0
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-5%',
                    width: '35%',
                    height: '200%',
                    background: `linear-gradient(135deg, ${alpha('#2962ff', 0.05)}, ${alpha('#2962ff', 0.02)})`,
                    transform: 'rotate(25deg)',
                    zIndex: 0
                }
            }}>
                <Box sx={{ 
                    position: 'relative', 
                    zIndex: 1,
                    p: 4
                }}>
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 6
                    }}>
                        <Box>
                            <Typography 
                                variant="h3"
                                sx={{
                                    fontSize: '2.5rem',
                                    fontWeight: 800,
                                    color: '#1a237e',
                                    mb: 1,
                                    position: 'relative',
                                    display: 'inline-block',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        left: 0,
                                        width: '40%',
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #2962ff, transparent)',
                                        borderRadius: '4px'
                                    }
                                }}
                            >
                                User Management
                            </Typography>
                            <Typography 
                                sx={{ 
                                    color: '#546e7a',
                                    fontSize: '1.1rem',
                                    maxWidth: '600px',
                                    lineHeight: 1.6
                                }}
                            >
                                Manage your system users, control access permissions, and monitor user activity all in one place.
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{
                                backgroundColor: '#2962ff',
                                color: '#fff',
                                px: 4,
                                py: 1.5,
                                borderRadius: '12px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                                    transform: 'translateX(-100%)',
                                    transition: 'transform 0.5s ease'
                                },
                                '&:hover': {
                                    backgroundColor: '#1e88e5',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(41, 98, 255, 0.15)',
                                    '&::before': {
                                        transform: 'translateX(100%)'
                                    }
                                }
                            }}
                        >
                            Add New User
                        </Button>
                    </Box>

                    {/* Stats Cards with Modern Design */}
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: 3
                    }}>
                        <Box sx={{
                            p: 3,
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%)',
                            border: '1px solid rgba(41, 98, 255, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '4px',
                                background: 'linear-gradient(90deg, #2962ff, #82b1ff)'
                            }
                        }}>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography sx={{ 
                                    color: '#2962ff',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Box component="span" sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: '#2962ff',
                                        display: 'inline-block'
                                    }} />
                                    Active Users
                                </Typography>
                                <Typography sx={{
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    color: '#1a237e',
                                    lineHeight: 1
                                }}>
                                    {activeUsers.length}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{
                            p: 3,
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
                            border: '1px solid rgba(244, 67, 54, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '4px',
                                background: 'linear-gradient(90deg, #f44336, #ff8a80)'
                            }
                        }}>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography sx={{ 
                                    color: '#f44336',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Box component="span" sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: '#f44336',
                                        display: 'inline-block'
                                    }} />
                                    Deactivated Users
                                </Typography>
                                <Typography sx={{
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    color: '#b71c1c',
                                    lineHeight: 1
                                }}>
                                    {inactiveUsers.length}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Content Area */}
            <Box sx={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                '& .MuiPaper-root': {
                    borderRadius: '16px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(41, 98, 255, 0.08)',
                    overflow: 'hidden'
                }
            }}>
                {/* Active Users Section */}
                <Card 
                    elevation={0} 
                    sx={{ 
                        width: '100%'
                    }}
                >
                    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    color: 'success.main', 
                                    fontWeight: 600,
                                    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                    fontSize: '1.2rem',
                                    letterSpacing: '0.15px'
                                }}
                            >
                                Active Users
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            overflowX: 'auto',
                            borderRadius: 2,
                            boxShadow: `0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                            background: theme.palette.background.paper,
                        }}>
                            <Table sx={{ 
                                minWidth: '100%',
                                width: '100%',
                                borderCollapse: 'separate',
                                borderSpacing: '0 4px',
                                m: 0,
                                p: 0
                            }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{
                                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            borderBottom: 'none',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            backgroundColor: alpha(theme.palette.background.default, 0.8)
                                        }}>Name</TableCell>
                                        <TableCell sx={{
                                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            borderBottom: 'none',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            backgroundColor: alpha(theme.palette.background.default, 0.8)
                                        }}>Role</TableCell>
                                        <TableCell sx={{
                                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            borderBottom: 'none',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            backgroundColor: alpha(theme.palette.background.default, 0.8)
                                        }}>Status</TableCell>
                                        <TableCell align="right" sx={{
                                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            borderBottom: 'none',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            backgroundColor: alpha(theme.palette.background.default, 0.8)
                                        }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {activeUsers.map((user) => (
                                        <TableRow 
                                            key={user.id} 
                                            sx={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                boxShadow: `0 0 1px ${alpha(theme.palette.divider, 0.3)}`,
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.03),
                                                    boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                                                    transform: 'translateY(-1px)',
                                                    transition: 'all 0.2s ease-in-out'
                                                }
                                            }}
                                        >
                                            <TableCell sx={{
                                                paddingTop: '16px',
                                                paddingBottom: '16px',
                                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                '&:first-of-type': {
                                                    borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                    borderTopLeftRadius: '8px',
                                                    borderBottomLeftRadius: '8px',
                                                },
                                            }}>
                                                <Typography 
                                                    variant="subtitle1" 
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                                        fontSize: '0.95rem',
                                                        letterSpacing: '0.1px',
                                                        color: theme.palette.text.primary,
                                                        display: 'inline-block',
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                        borderRadius: '4px',
                                                        padding: '4px 12px',
                                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                                    }}
                                                >
                                                    {user.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                paddingTop: '16px',
                                                paddingBottom: '16px',
                                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                            }}>
                                                <Typography 
                                                    sx={{
                                                        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                                        fontSize: '0.9rem',
                                                        letterSpacing: '0.1px',
                                                        color: theme.palette.text.primary,
                                                        fontWeight: 500,
                                                        display: 'inline-block',
                                                        backgroundColor: alpha(theme.palette.info.main, 0.05),
                                                        borderRadius: '4px',
                                                        padding: '4px 12px',
                                                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                                                    }}
                                                >
                                                    {user.role}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                paddingTop: '16px',
                                                paddingBottom: '16px',
                                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                            }}>
                                                <Chip
                                                    label="Active"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                                        color: theme.palette.success.dark,
                                                        fontWeight: 600,
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        height: '24px',
                                                        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                                        letterSpacing: '0.5px',
                                                        textTransform: 'uppercase',
                                                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                                        '.MuiChip-label': {
                                                            padding: '0 8px'
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell 
                                                align="right"
                                                sx={{
                                                    paddingTop: '16px',
                                                    paddingBottom: '16px',
                                                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                    '&:last-of-type': {
                                                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                        borderTopRightRadius: '8px',
                                                        borderBottomRightRadius: '8px',
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenDialog(user)}
                                                        sx={{ 
                                                            color: theme.palette.primary.main,
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                            '&:hover': { 
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                            },
                                                            width: 30,
                                                            height: 30
                                                        }}
                                                    >
                                                        <EditIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeactivateClick(user.id, user.active)}
                                                        sx={{ 
                                                            color: theme.palette.error.main,
                                                            backgroundColor: alpha(theme.palette.error.main, 0.05),
                                                            '&:hover': { 
                                                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                            },
                                                            width: 30,
                                                            height: 30
                                                        }}
                                                    >
                                                        <BlockIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </CardContent>
                </Card>

                {/* Deactivated Users Section */}
                <Card 
                    elevation={0}
                    sx={{ 
                        width: '100%',
                        mb: 3
                    }}
                >
                    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    color: 'error.main', 
                                    fontWeight: 600,
                                    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                    fontSize: '1.2rem',
                                    letterSpacing: '0.15px'
                                }}
                            >
                                Deactivated Users
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            overflowX: 'auto',
                            borderRadius: 2,
                            boxShadow: `0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                            background: theme.palette.background.paper,
                        }}>
                            <Table sx={{ 
                                minWidth: '100%',
                                width: '100%',
                                borderCollapse: 'separate',
                                borderSpacing: '0 4px',
                                m: 0,
                                p: 0
                            }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{
                                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            borderBottom: 'none',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            backgroundColor: alpha(theme.palette.background.default, 0.8)
                                        }}>Name</TableCell>
                                        <TableCell sx={{
                                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            borderBottom: 'none',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            backgroundColor: alpha(theme.palette.background.default, 0.8)
                                        }}>Role</TableCell>
                                        <TableCell sx={{
                                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            borderBottom: 'none',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            backgroundColor: alpha(theme.palette.background.default, 0.8)
                                        }}>Status</TableCell>
                                        <TableCell sx={{
                                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            borderBottom: 'none',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            backgroundColor: alpha(theme.palette.background.default, 0.8)
                                        }}>Reason</TableCell>
                                        <TableCell align="right" sx={{
                                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            borderBottom: 'none',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            backgroundColor: alpha(theme.palette.background.default, 0.8)
                                        }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inactiveUsers.map((user) => (
                                        <TableRow 
                                            key={user.id} 
                                            sx={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                boxShadow: `0 0 1px ${alpha(theme.palette.divider, 0.3)}`,
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.03),
                                                    boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                                                    transform: 'translateY(-1px)',
                                                    transition: 'all 0.2s ease-in-out'
                                                }
                                            }}
                                        >
                                            <TableCell sx={{
                                                paddingTop: '16px',
                                                paddingBottom: '16px',
                                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                '&:first-of-type': {
                                                    borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                    borderTopLeftRadius: '8px',
                                                    borderBottomLeftRadius: '8px',
                                                },
                                            }}>
                                                <Typography 
                                                    variant="subtitle1" 
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                                        fontSize: '0.95rem',
                                                        letterSpacing: '0.1px',
                                                        color: theme.palette.text.primary,
                                                        display: 'inline-block',
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                        borderRadius: '4px',
                                                        padding: '4px 12px',
                                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                                    }}
                                                >
                                                    {user.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                paddingTop: '16px',
                                                paddingBottom: '16px',
                                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                            }}>
                                                <Typography 
                                                    sx={{
                                                        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                                        fontSize: '0.9rem',
                                                        letterSpacing: '0.1px',
                                                        color: theme.palette.text.primary,
                                                        fontWeight: 500,
                                                        display: 'inline-block',
                                                        backgroundColor: alpha(theme.palette.info.main, 0.05),
                                                        borderRadius: '4px',
                                                        padding: '4px 12px',
                                                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                                                    }}
                                                >
                                                    {user.role}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                paddingTop: '16px',
                                                paddingBottom: '16px',
                                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                            }}>
                                                <Chip
                                                    label="Inactive"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                                        color: theme.palette.error.dark,
                                                        fontWeight: 600,
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        height: '24px',
                                                        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                                        letterSpacing: '0.5px',
                                                        textTransform: 'uppercase',
                                                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                                        '.MuiChip-label': {
                                                            padding: '0 8px'
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{
                                                paddingTop: '16px',
                                                paddingBottom: '16px',
                                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                            }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        fontStyle: 'italic',
                                                        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                                        fontSize: '0.9rem',
                                                        letterSpacing: '0.1px',
                                                        fontWeight: 500,
                                                        backgroundColor: alpha(theme.palette.error.main, 0.05),
                                                        borderRadius: '4px',
                                                        padding: '4px 8px',
                                                        display: 'inline-block',
                                                        border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`
                                                    }}
                                                >
                                                    {user.reason || 'No reason provided'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell 
                                                align="right"
                                                sx={{
                                                    paddingTop: '16px',
                                                    paddingBottom: '16px',
                                                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                    '&:last-of-type': {
                                                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                        borderTopRightRadius: '8px',
                                                        borderBottomRightRadius: '8px',
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenDialog(user)}
                                                        sx={{ 
                                                            color: theme.palette.primary.main,
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                            '&:hover': { 
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                            },
                                                            width: 30,
                                                            height: 30
                                                        }}
                                                    >
                                                        <EditIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeactivateClick(user.id, user.active)}
                                                        sx={{ 
                                                            color: theme.palette.success.main,
                                                            backgroundColor: alpha(theme.palette.success.main, 0.05),
                                                            '&:hover': { 
                                                                backgroundColor: alpha(theme.palette.success.main, 0.1),
                                                            },
                                                            width: 30,
                                                            height: 30
                                                        }}
                                                    >
                                                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Add/Edit User Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="xs" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    }
                }}
            >
                <DialogTitle sx={{ pb: 0 }}>
                    <Typography 
                        variant="h6" 
                        fontWeight={600}
                        sx={{
                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                            fontSize: '1.1rem',
                            letterSpacing: '0.15px'
                        }}
                    >
                        {editingUser ? 'Edit User' : 'Add New User'}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Role"
                            value={formData.role}
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        >
                            <MenuItem value="Layout Artist">Layout Artist</MenuItem>
                            <MenuItem value="Manager">Manager</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            label="PIN"
                            type="password"
                            value={formData.pin}
                            onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                    <Button 
                        onClick={handleCloseDialog}
                        sx={{ 
                            borderRadius: 2,
                            px: 2,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ 
                            px: 3,
                            borderRadius: 2,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                            }
                        }}
                    >
                        {editingUser ? 'Save Changes' : 'Add User'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Deactivation Reason Dialog */}
            <Dialog 
                open={openDeactivateDialog} 
                onClose={() => setOpenDeactivateDialog(false)} 
                maxWidth="xs" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    }
                }}
            >
                <DialogTitle sx={{ pb: 0 }}>
                    <Typography 
                        variant="h6" 
                        fontWeight={600}
                        sx={{
                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                            fontSize: '1.1rem',
                            letterSpacing: '0.15px'
                        }}
                    >
                        Deactivate User
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography 
                            variant="body1" 
                            color="text.secondary"
                            sx={{
                                fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                fontSize: '0.95rem',
                                letterSpacing: '0.1px'
                            }}
                        >
                            Please select a reason for deactivating this user:
                        </Typography>
                        <TextField
                            fullWidth
                            select
                            label="Reason"
                            value={deactivationReason}
                            onChange={(e) => setDeactivationReason(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        >
                            {deactivationReasons.map(reason => (
                                <MenuItem key={reason} value={reason}>{reason}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                    <Button 
                        onClick={() => setOpenDeactivateDialog(false)}
                        sx={{ 
                            borderRadius: 2,
                            px: 2,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleDeactivateSubmit}
                        color="error"
                        sx={{ 
                            px: 3,
                            borderRadius: 2,
                            background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                            '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
                            }
                        }}
                    >
                        Deactivate
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Password Dialog */}
            <Dialog 
                open={openPasswordDialog} 
                onClose={() => setOpenPasswordDialog(false)} 
                maxWidth="xs" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    }
                }}
            >
                <DialogTitle sx={{ pb: 0 }}>
                    <Typography 
                        variant="h6" 
                        fontWeight={600}
                        sx={{
                            fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                            fontSize: '1.1rem',
                            letterSpacing: '0.15px'
                        }}
                    >
                        Enter Admin Password
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Admin Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                    <Button 
                        onClick={() => setOpenPasswordDialog(false)}
                        sx={{ 
                            borderRadius: 2,
                            px: 2,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handlePasswordSubmit}
                        sx={{ 
                            px: 3,
                            borderRadius: 2,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                            }
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity}
                    sx={{ 
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: theme.shadows[3],
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Users;
