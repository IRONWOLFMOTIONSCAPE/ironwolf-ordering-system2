import React, { useState, useEffect } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert,
    Snackbar,
    useTheme,
    alpha,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import BackupIcon from '@mui/icons-material/Backup';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { listBackups, restoreBackup, createBackup, clearAllBackups, resetAllData } from '../../utils/backupManager';
import { loadDemoData, exitDemoMode, isDemoMode } from '../../utils/demoManager';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

interface BackupData {
    orders: any[];
    timestamp: string;
    backupId: string;
}

const BackupManager = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [backups, setBackups] = useState<BackupData[]>([]);
    const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
    const [demoConfirmOpen, setDemoConfirmOpen] = useState(false);
    const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [isDemo, setIsDemo] = useState(isDemoMode());

    useEffect(() => {
        loadBackups();
        // Listen for storage changes
        window.addEventListener('storage', loadBackups);
        window.addEventListener('ordersUpdated', loadBackups);
        
        return () => {
            window.removeEventListener('storage', loadBackups);
            window.removeEventListener('ordersUpdated', loadBackups);
        };
    }, []);

    const loadBackups = () => {
        const allBackups = listBackups();
        setBackups(allBackups);
    };

    const handleRestoreClick = (backupId: string) => {
        setSelectedBackup(backupId);
        setConfirmOpen(true);
    };

    const handleConfirmRestore = () => {
        if (selectedBackup) {
            const success = restoreBackup(selectedBackup);
            if (success) {
                setSnackbarMessage('Backup restored successfully');
                setSnackbarSeverity('success');
            } else {
                setSnackbarMessage('Failed to restore backup');
                setSnackbarSeverity('error');
            }
            setSnackbarOpen(true);
            setConfirmOpen(false);
            loadBackups();
        }
    };

    const handleCreateBackup = async () => {
        const backupId = await createBackup();
        if (backupId) {
            setSnackbarMessage('Backup created successfully');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage('Failed to create backup');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
        loadBackups();
    };

    const handleClearAllBackups = () => {
        const success = clearAllBackups();
        if (success) {
            setSnackbarMessage('All backups cleared successfully');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage('Failed to clear backups');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
        setClearConfirmOpen(false);
        loadBackups();
    };

    const handleResetData = () => {
        const success = resetAllData();
        if (success) {
            setSnackbarMessage('All data has been reset to initial state. A backup was created.');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage('Failed to reset data');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
        setResetConfirmOpen(false);
        loadBackups();
    };

    const handleDemoMode = () => {
        const success = loadDemoData();
        if (success) {
            setSnackbarMessage('Demo mode activated successfully');
            setSnackbarSeverity('success');
            setIsDemo(true);
        } else {
            setSnackbarMessage('Failed to activate demo mode');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
        setDemoConfirmOpen(false);
        loadBackups();
    };

    const handleExitDemo = () => {
        if (exitDemoMode()) {
            setSnackbarMessage('Exited demo mode successfully');
            setSnackbarSeverity('success');
            setIsDemo(false);
            dispatch(logout());
            navigate('/');
        } else {
            setSnackbarMessage('Failed to exit demo mode');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
        loadBackups();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                    Backup Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {isDemo ? (
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<ExitToAppIcon />}
                            onClick={handleExitDemo}
                            sx={{
                                background: 'linear-gradient(135deg, #FF9800 0%, #ED6C02 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #ED6C02 0%, #FF9800 100%)',
                                },
                            }}
                        >
                            Exit Demo Mode
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            startIcon={<PlayCircleOutlineIcon />}
                            onClick={() => setDemoConfirmOpen(true)}
                            sx={{
                                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
                                },
                            }}
                        >
                            Try Demo Mode
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteSweepIcon />}
                        onClick={() => setClearConfirmOpen(true)}
                        sx={{
                            background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
                            },
                        }}
                    >
                        Clear All Backups
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        startIcon={<RestartAltIcon />}
                        onClick={() => setResetConfirmOpen(true)}
                        sx={{
                            background: 'linear-gradient(135deg, #FF9800 0%, #ED6C02 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #ED6C02 0%, #FF9800 100%)',
                            },
                        }}
                    >
                        Reset All Data
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<BackupIcon />}
                        onClick={handleCreateBackup}
                        sx={{
                            background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
                            },
                        }}
                    >
                        Create Backup
                    </Button>
                </Box>
            </Box>
            
            <Paper 
                elevation={0}
                sx={{
                    background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.background.paper, 0.95)}, 
                        ${alpha(theme.palette.background.paper, 0.7)})`,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    borderRadius: 2,
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Backup ID</TableCell>
                                <TableCell>Date & Time</TableCell>
                                <TableCell>Orders Count</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {backups.map((backup) => (
                                <TableRow key={backup.backupId}>
                                    <TableCell>{backup.backupId}</TableCell>
                                    <TableCell>
                                        {format(new Date(backup.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                                    </TableCell>
                                    <TableCell>{backup.orders.length}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => handleRestoreClick(backup.backupId)}
                                            sx={{
                                                color: theme.palette.primary.main,
                                                '&:hover': {
                                                    color: theme.palette.primary.dark,
                                                }
                                            }}
                                        >
                                            <RestoreIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {backups.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography color="textSecondary">
                                            No backups available
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Confirm Restore Dialog */}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            >
                <DialogTitle>Confirm Restore</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to restore this backup? This will:
                        <ul>
                            <li>Replace all current orders with the backup data</li>
                            <li>Create a backup of your current data first</li>
                        </ul>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmRestore} color="primary" variant="contained">
                        Restore Backup
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Clear All Backups Confirmation Dialog */}
            <Dialog
                open={clearConfirmOpen}
                onClose={() => setClearConfirmOpen(false)}
            >
                <DialogTitle>Clear All Backups</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to clear all backups? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setClearConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleClearAllBackups} color="error" variant="contained">
                        Clear All Backups
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reset Data Confirmation Dialog */}
            <Dialog
                open={resetConfirmOpen}
                onClose={() => setResetConfirmOpen(false)}
            >
                <DialogTitle>Reset All Data?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will reset all data to its initial state. A backup of your current data will be created before resetting.
                        This action cannot be undone (except through backup restoration).
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetConfirmOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleResetData} 
                        color="warning"
                        variant="contained"
                    >
                        Reset Data
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Demo Mode Confirmation Dialog */}
            <Dialog
                open={demoConfirmOpen}
                onClose={() => setDemoConfirmOpen(false)}
            >
                <DialogTitle>Activate Demo Mode</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to activate demo mode? This will:
                        <ul>
                            <li>Create a backup of your current data</li>
                            <li>Load sample data for demonstration</li>
                            <li>Create demo users (manager/staff)</li>
                            <li>You can exit demo mode anytime</li>
                        </ul>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDemoConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleDemoMode} color="primary" variant="contained">
                        Activate Demo Mode
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert 
                    onClose={() => setSnackbarOpen(false)} 
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BackupManager;
