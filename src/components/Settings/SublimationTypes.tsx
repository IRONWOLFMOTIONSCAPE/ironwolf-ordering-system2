import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Alert,
    Snackbar,
    useTheme,
    alpha
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface SublimationType {
    id: string;
    type: string;
    price: number;
}

const SublimationTypes = () => {
    const theme = useTheme();
    const [types, setTypes] = useState<SublimationType[]>(() => {
        const savedTypes = localStorage.getItem('sublimationTypes');
        return savedTypes ? JSON.parse(savedTypes) : [
            { id: '1', type: 'Shirt', price: 350 },
            { id: '2', type: 'Jersey', price: 450 },
            { id: '3', type: 'Jacket', price: 550 },
            { id: '4', type: 'ID Lace', price: 50 },
            { id: '5', type: 'Mug', price: 150 },
            { id: '6', type: 'Cap', price: 250 }
        ];
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [editingType, setEditingType] = useState<SublimationType | null>(null);
    const [newType, setNewType] = useState({ type: '', price: 0 });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleAddClick = () => {
        setEditingType(null);
        setNewType({ type: '', price: 0 });
        setOpenDialog(true);
    };

    const handleEditClick = (type: SublimationType) => {
        setEditingType(type);
        setNewType({ type: type.type, price: type.price });
        setOpenDialog(true);
    };

    const handleDeleteClick = (id: string) => {
        if (window.confirm('Are you sure you want to delete this sublimation type?')) {
            const updatedTypes = types.filter(t => t.id !== id);
            setTypes(updatedTypes);
            localStorage.setItem('sublimationTypes', JSON.stringify(updatedTypes));
            
            // Dispatch custom event to notify other components
            const event = new CustomEvent('sublimationTypesChanged', { 
                detail: { types: updatedTypes }
            });
            window.dispatchEvent(event);
            
            setSuccessMessage('Sublimation type deleted successfully');
        }
    };

    const handleSave = () => {
        if (!newType.type || newType.price <= 0) {
            setError('Please fill in all fields correctly');
            return;
        }

        let updatedTypes;
        if (editingType) {
            updatedTypes = types.map(t => 
                t.id === editingType.id 
                    ? { ...t, type: newType.type, price: newType.price }
                    : t
            );
            setSuccessMessage('Sublimation type updated successfully');
        } else {
            const newId = (Math.max(...types.map(t => parseInt(t.id))) + 1).toString();
            updatedTypes = [...types, { id: newId, ...newType }];
            setSuccessMessage('New sublimation type added successfully');
        }

        setTypes(updatedTypes);
        localStorage.setItem('sublimationTypes', JSON.stringify(updatedTypes));
        
        // Dispatch custom event to notify other components
        const event = new CustomEvent('sublimationTypesChanged', { 
            detail: { types: updatedTypes }
        });
        window.dispatchEvent(event);
        
        setOpenDialog(false);
        setError('');
    };

    return (
        <Box sx={{ height: '100%' }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Box>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 600,
                            color: theme.palette.mode === 'dark' 
                                ? theme.palette.primary.light 
                                : theme.palette.primary.main
                        }}
                    >
                        Sublimation Types
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: theme.palette.text.secondary,
                            mt: 0.5
                        }}
                    >
                        Manage your sublimation products and pricing
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                    sx={{
                        boxShadow: 2,
                        '&:hover': {
                            boxShadow: 4
                        }
                    }}
                >
                    Add New Type
                </Button>
            </Box>

            <TableContainer 
                sx={{ 
                    mt: 3,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    '& .MuiTableCell-root': {
                        borderColor: theme.palette.divider,
                    }
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell 
                                sx={{ 
                                    fontWeight: 600,
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.primary.main, 0.1)
                                        : alpha(theme.palette.primary.light, 0.1),
                                    borderTopLeftRadius: 8,
                                    fontSize: '0.95rem',
                                    py: 2.5,
                                    pl: 3,
                                    width: '40%'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Type
                                </Box>
                            </TableCell>
                            <TableCell 
                                sx={{ 
                                    fontWeight: 600,
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.primary.main, 0.1)
                                        : alpha(theme.palette.primary.light, 0.1),
                                    fontSize: '0.95rem',
                                    py: 2.5,
                                    width: '30%'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Price
                                </Box>
                            </TableCell>
                            <TableCell 
                                align="right"
                                sx={{ 
                                    fontWeight: 600,
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.primary.main, 0.1)
                                        : alpha(theme.palette.primary.light, 0.1),
                                    borderTopRightRadius: 8,
                                    fontSize: '0.95rem',
                                    py: 2.5,
                                    pr: 3,
                                    width: '30%'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    Actions
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {types.map((type, index) => (
                            <TableRow 
                                key={type.id}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? alpha(theme.palette.primary.main, 0.05)
                                            : alpha(theme.palette.primary.light, 0.05)
                                    },
                                    '&:last-child td': { 
                                        borderBottom: 0,
                                        '&:first-of-type': {
                                            borderBottomLeftRadius: 8
                                        },
                                        '&:last-child': {
                                            borderBottomRightRadius: 8
                                        }
                                    }
                                }}
                            >
                                <TableCell 
                                    sx={{ 
                                        fontWeight: 500,
                                        pl: 3,
                                        py: 2.5,
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? alpha(theme.palette.primary.main, 0.2)
                                                : alpha(theme.palette.primary.light, 0.2),
                                            color: theme.palette.primary.main
                                        }}>
                                            {type.type.charAt(0)}
                                        </Box>
                                        {type.type}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ py: 2.5 }}>
                                    <Box sx={{ 
                                        display: 'inline-flex', 
                                        alignItems: 'center',
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? alpha(theme.palette.success.main, 0.1)
                                            : alpha(theme.palette.success.light, 0.1),
                                        color: theme.palette.success.main,
                                        py: 0.5,
                                        px: 1.5,
                                        borderRadius: 1.5,
                                        fontSize: '0.9rem',
                                        fontWeight: 600
                                    }}>
                                        ₱{type.price.toFixed(2)}
                                    </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ pr: 2, py: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <IconButton 
                                            onClick={() => handleEditClick(type)} 
                                            sx={{ 
                                                backgroundColor: theme.palette.mode === 'dark'
                                                    ? alpha(theme.palette.primary.main, 0.1)
                                                    : alpha(theme.palette.primary.light, 0.1),
                                                borderRadius: 2,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.mode === 'dark'
                                                        ? alpha(theme.palette.primary.main, 0.2)
                                                        : alpha(theme.palette.primary.light, 0.2),
                                                }
                                            }}
                                        >
                                            <EditIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => handleDeleteClick(type.id)}
                                            sx={{ 
                                                backgroundColor: theme.palette.mode === 'dark'
                                                    ? alpha(theme.palette.error.main, 0.1)
                                                    : alpha(theme.palette.error.light, 0.1),
                                                borderRadius: 2,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.mode === 'dark'
                                                        ? alpha(theme.palette.error.main, 0.2)
                                                        : alpha(theme.palette.error.light, 0.2),
                                                }
                                            }}
                                        >
                                            <DeleteIcon sx={{ fontSize: 20, color: theme.palette.error.main }} />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog 
                open={openDialog} 
                onClose={() => {
                    setOpenDialog(false);
                    setError('');
                    setNewType({ type: '', price: 0 });
                }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: theme.shadows[5]
                    }
                }}
                sx={{
                    zIndex: theme.zIndex.modal + 1,
                    '& .MuiDialog-paper': {
                        margin: 2
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {editingType ? 'Edit Sublimation Type' : 'Add New Sublimation Type'}
                    </Typography>
                </DialogTitle>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}>
                    <DialogContent sx={{ mt: 2 }}>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            label="Type Name"
                            fullWidth
                            value={newType.type}
                            onChange={(e) => setNewType({ ...newType, type: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            required
                            margin="dense"
                            label="Price"
                            type="number"
                            fullWidth
                            value={newType.price}
                            onChange={(e) => setNewType({ ...newType, price: Math.max(0, Number(e.target.value)) })}
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>₱</Typography>
                            }}
                        />
                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mt: 2,
                                    borderRadius: 1
                                }}
                            >
                                {error}
                            </Alert>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2, pt: 1 }}>
                        <Button 
                            type="button"
                            onClick={() => {
                                setOpenDialog(false);
                                setError('');
                                setNewType({ type: '', price: 0 });
                            }}
                            sx={{ 
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.text.secondary, 0.1)
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            variant="contained"
                            sx={{
                                boxShadow: 1,
                                '&:hover': {
                                    boxShadow: 2
                                }
                            }}
                        >
                            {editingType ? 'Save Changes' : 'Add Type'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage('')}
                message={successMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
        </Box>
    );
};

export default SublimationTypes;
