import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    InputAdornment,
    Alert,
    Snackbar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    styled
} from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { Theme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import CheckIcon from '@mui/icons-material/Check';
import AlarmIcon from '@mui/icons-material/Alarm';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CategoryIcon from '@mui/icons-material/Category';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BrushIcon from '@mui/icons-material/Brush';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { AppRootState } from '../../app/store';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getNextOrderNumber, saveOrderNumber } from '../../utils/orderNumberGenerator';
import { createBackup } from '../../utils/backupManager';
import './styles.css';

interface ValidationErrors {
    orderDetails?: string[];
    customerInfo?: string[];
    sublimationItems?: string[];
}

interface OrderForm {
    customer: {
        name: string;
        email: string;
        contact: string;
    };
    deadline: string;
    type: string;
    deposit: number;
    discountPercentage: number;
    sublimationOrders: {
        id: string;
        type: string;
        pricePerUnit: number;
        quantity: number;
        totalPrice: number;
    }[];
}

interface StepItem {
    label: string;
    icon: JSX.Element;
}

interface CustomTheme {
    palette: {
        mode: 'light' | 'dark';
        grey: {
            [key: number]: string;
        };
    };
}

interface Props {
    onSectionChange: (section: "home" | "create" | "history" | "reports" | "tracking" | "settings-users" | "settings-sublimation") => void;
}

interface SublimationType {
    id: string;
    type: string;
    price: number;
}

const steps: StepItem[] = [
    { label: 'Order Details', icon: <ReceiptLongIcon /> },
    { label: 'Customer Info', icon: <PersonIcon /> },
    { label: 'Sublimation Orders', icon: <ShoppingCartIcon /> }
];

const pageVariants = {
    initial: { 
        opacity: 0, 
        x: -20,
        scale: 0.95
    },
    animate: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    exit: { 
        opacity: 0, 
        x: 20,
        scale: 0.95,
        transition: {
            duration: 0.3
        }
    }
};

const formVariants = {
    hidden: { 
        opacity: 0, 
        y: 20,
        scale: 0.98
    },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3
        }
    }
};

const fieldVariants = {
    hidden: { 
        opacity: 0, 
        y: 20,
        scale: 0.98
    },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3
        }
    }
};

const commonFieldStyles = {
    '& .MuiInputLabel-root': {
        fontSize: '0.95rem',
        fontWeight: 500,
        color: 'text.secondary',
        transition: 'all 0.2s ease-in-out'
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'primary.main'
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '& fieldset': {
            borderColor: 'divider',
            transition: 'all 0.2s ease-in-out'
        },
        '&:hover fieldset': {
            borderColor: 'primary.light'
        },
        '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            borderWidth: '2px'
        }
    },
    '& .MuiOutlinedInput-input': {
        fontSize: '1rem',
        padding: '14px 16px',
        transition: 'all 0.2s ease-in-out'
    },
    '& .MuiInputAdornment-root': {
        '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
            color: 'primary.main',
            transition: 'all 0.2s ease-in-out'
        }
    }
};

const StepIconRoot = styled('div', {
    shouldForwardProp: (prop) => prop !== 'ownerState',
})<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.5s ease-in-out',
    ...(ownerState.active && {
        backgroundColor: '#4caf50',
        boxShadow: '0 4px 10px 0 rgba(76, 175, 80, .25)',
    }),
    ...(ownerState.completed && {
        backgroundColor: '#4caf50',
    }),
}));

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            background: 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            background: '#4caf50',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
        transition: 'all 0.5s ease-in-out',
    },
}));

// Enhanced fluid animation variants
const fluidVariants = {
    initial: { 
        height: 0,
        
        scale: 0.8,
        background: 'linear-gradient(180deg, #4caf50 0%, #81c784 50%, #4caf50 100%)',
        backgroundSize: '200% 200%',
    },
    animate: { 
        height: '100%',
        opacity: [0, 1, 1],
        scale: [0.8, 1.1, 1],
        transition: {
            height: { duration: 0.5, ease: "easeOut" },
            opacity: { duration: 0.8, times: [0, 0.5, 1] },
            scale: { duration: 0.8, times: [0, 0.6, 1], ease: "easeOut" },
        }
    }
};

// Pulse animation for active step
const pulseVariants = {
    initial: { scale: 1 },
    animate: { 
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Enhanced step completion animation
const completionVariants = {
    initial: { 
        scale: 0,
        opacity: 0 
    },
    animate: { 
        scale: [0, 1.2, 1],
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        }
    }
};

function CustomStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <BadgeIcon />,
        2: <PersonIcon />,
        3: <ShoppingCartIcon />,
    };

    return (
        <StepIconRoot ownerState={{ completed, active }} className={className}>
            {completed ? (
                <motion.div
                    variants={completionVariants}
                    initial="initial"
                    animate="animate"
                >
                    <CheckIcon />
                </motion.div>
            ) : (
                <motion.div
                    variants={active ? pulseVariants : {}}
                    initial="initial"
                    animate={active ? "animate" : ""}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {icons[String(props.icon)]}
                </motion.div>
            )}
        </StepIconRoot>
    );
}

const CreateOrder: React.FC<Props> = ({ onSectionChange }) => {
    const user = useSelector((state: AppRootState) => state.auth.user);
    const [activeStep, setActiveStep] = useState(0);
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [jobSerial, setJobSerial] = useState<string>('');
    const navigate = useNavigate();
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'error' as 'success' | 'error' | 'info' | 'warning'
    });
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [sublimationTypes, setSublimationTypes] = useState<SublimationType[]>(() => {
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

    useEffect(() => {
        const handleStorageChange = () => {
            const savedTypes = localStorage.getItem('sublimationTypes');
            if (savedTypes) {
                setSublimationTypes(JSON.parse(savedTypes));
            }
        };

        const handleTypesChanged = (event: CustomEvent) => {
            setSublimationTypes(event.detail.types);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('sublimationTypesChanged', handleTypesChanged as EventListener);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('sublimationTypesChanged', handleTypesChanged as EventListener);
        };
    }, []);

    useEffect(() => {
        // Get the next order number when component mounts
        const { orderNumber: nextOrderNumber, jobSerial: nextJobSerial } = getNextOrderNumber(user?.name || '');
        setOrderNumber(nextOrderNumber);
        setJobSerial(nextJobSerial);
    }, [user]);

    const [orderForm, setOrderForm] = useState({
        customer: {
            name: '',
            email: '',
            contact: ''
        },
        deadline: format(new Date(), 'yyyy-MM-dd'),
        type: 'NEW',
        deposit: 0,
        discountPercentage: 0,
        sublimationOrders: [
            {
                id: uuidv4(),
                type: '',
                pricePerUnit: 0,
                quantity: 1,
                totalPrice: 0
            }
        ]
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const validateStep = () => {
        let errorMessage = '';

        if (activeStep === 0) {
            if (!orderForm.deadline) {
                errorMessage = 'Please select a deadline';
            } else if (!orderForm.type) {
                errorMessage = 'Please select an order type';
            }
        } else if (activeStep === 1) {
            const errors: string[] = [];
            if (!orderForm.customer.name) errors.push('Customer name is required');
            if (!orderForm.customer.contact) errors.push('Contact number is required');
            if (orderForm.customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderForm.customer.email)) {
                errors.push('Please enter a valid email address');
            }
            
            if (errors.length > 0) {
                errorMessage = errors.join(', ');
            }
        } else if (activeStep === 2) {
            const errors: string[] = [];
            orderForm.sublimationOrders.forEach((order, index) => {
                if (!order.type) errors.push(`Please select type for order ${index + 1}`);
                if (!order.quantity || order.quantity < 1) errors.push(`Please enter a valid quantity for order ${index + 1}`);
            });
            
            if (errors.length > 0) {
                errorMessage = errors.join(', ');
            }
        }

        if (errorMessage) {
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
            return false;
        }
        
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (activeStep === steps.length - 1) {
                setConfirmDialogOpen(true);
            } else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async () => {
        try {
            // Validate sublimation orders
            const invalidOrders = orderForm.sublimationOrders.some(order => 
                !order.type || order.quantity < 1 || order.pricePerUnit <= 0
            );
            
            if (invalidOrders) {
                setSnackbar({
                    open: true,
                    message: 'Please fill in all sublimation order details correctly',
                    severity: 'error'
                });
                return;
            }

            setLoading(true);
            
            // Simulate API call with 3 second delay
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const newOrder = {
                jobOrderNumber: jobSerial,
                serialJobNumber: orderNumber,
                customerName: orderForm.customer.name,
                status: 'Pending',
                orderType: orderForm.type,
                deadline: orderForm.deadline,
                billingStatus: orderForm.deposit > 0 ? 'Partially Paid' : 'Unpaid',
                totalAmount: orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0),
                depositAmount: orderForm.deposit,
                balance: orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) - orderForm.deposit,
                customerDetails: {
                    name: orderForm.customer.name,
                    email: orderForm.customer.email || '',
                    contact: orderForm.customer.contact
                },
                orderDetails: {
                    type: orderForm.type,
                    layoutArtist: user?.name,
                    dateOfOrder: format(new Date(), 'yyyy-MM-dd'),
                    sublimationOrders: orderForm.sublimationOrders.map(order => ({
                        type: order.type,
                        pricePerUnit: order.pricePerUnit,
                        quantity: order.quantity,
                        totalPrice: order.totalPrice
                    }))
                }
            };

            // Store the order in localStorage
            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            existingOrders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(existingOrders));

            // Create a backup after successful order creation
            await createBackup();

            // Save the current order number to ensure it increments for the next order
            saveOrderNumber(orderNumber);

            // Get new order numbers for the next order
            const { orderNumber: nextOrderNumber, jobSerial: nextJobSerial } = getNextOrderNumber(user?.name || '');
            setOrderNumber(nextOrderNumber);
            setJobSerial(nextJobSerial);

            setLoading(false);
            setShowSuccess(true);
            setConfirmDialogOpen(false);

            // Navigate to tracking page after successful submission
            setTimeout(() => {
                onSectionChange('tracking');
            }, 1500);

        } catch (error) {
            console.error('Error creating order:', error);
            setLoading(false);
            setSnackbar({
                open: true,
                message: 'Error creating order. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleCustomerChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrderForm(prev => ({
            ...prev,
            customer: {
                ...prev.customer,
                [field]: event.target.value
            }
        }));
    };

    const handleSublimationTypeChange = (index: number, value: string) => {
        const updatedOrders = [...orderForm.sublimationOrders];
        const selectedType = sublimationTypes.find(t => t.type === value);
        
        if (selectedType) {
            updatedOrders[index] = {
                ...updatedOrders[index],
                type: value,
                pricePerUnit: selectedType.price,
                totalPrice: selectedType.price * (updatedOrders[index].quantity || 1)
            };
            
            setOrderForm(prev => ({
                ...prev,
                sublimationOrders: updatedOrders
            }));
        }
    };

    const handleSublimationChange = (index: number, field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOrders = [...orderForm.sublimationOrders];
        const value = event.target.value;

        if (field === 'quantity') {
            const quantity = parseInt(value) || 0;
            newOrders[index] = {
                ...newOrders[index],
                quantity,
                totalPrice: newOrders[index].pricePerUnit * quantity
            };
        }

        setOrderForm(prev => ({
            ...prev,
            sublimationOrders: newOrders
        }));
    };

    const addSublimationOrder = () => {
        setOrderForm(prev => ({
            ...prev,
            sublimationOrders: [
                ...prev.sublimationOrders,
                {
                    id: uuidv4(),
                    type: '',
                    pricePerUnit: 0,
                    quantity: 1,
                    totalPrice: 0
                }
            ]
        }));
    };

    const removeSublimationOrder = (index: number) => {
        if (orderForm.sublimationOrders.length === 1) return;
        const newOrders = orderForm.sublimationOrders.filter((_, i) => i !== index);
        setOrderForm(prev => ({
            ...prev,
            sublimationOrders: newOrders
        }));
    };

    const handlePrint = () => {
        const printContent = document.createElement('div');
        printContent.className = 'print-only';
        printContent.innerHTML = `
            <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 8.5in; margin: 0 auto; position: relative; background: white;">
                <div style="text-align: center; margin-bottom: 30px; position: relative;">
                    <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: black; padding: 4px 15px; border-radius: 0 0 8px 8px;">
                        <h3 style="margin: 0; color: white; font-size: 12px; letter-spacing: 1px;">PHASE 1 INVOICE</h3>
                    </div>
                    <div style="border: 1.5px solid black; padding: 25px 15px 15px;">
                        <h1 style="font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 900;">IRONWOLF</h1>
                        <h2 style="font-size: 14px; margin: 5px 0; letter-spacing: 2px; text-transform: uppercase;">Digital Printing</h2>
                        <p style="font-size: 12px; margin: 5px 0; font-style: italic;">Professional Sublimation Printing Services</p>
                    </div>
                </div>

                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div style="flex: 1; border: 1px solid black; padding: 15px; position: relative;">
                        <div style="position: absolute; top: -10px; left: 10px; background: white; padding: 0 5px;">
                            <h4 style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order Information</h4>
                        </div>
                        <div style="margin-top: 5px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px; width: 40%;"><strong>Quote No:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${orderNumber}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Job Serial:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${jobSerial}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Date:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${format(new Date(), 'MMMM dd, yyyy')}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Deadline:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${orderForm.deadline ? format(new Date(orderForm.deadline), 'MMMM dd, yyyy') : 'Not set'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Order Type:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${orderForm.type === 'NEW' ? 'New Order' : 'PAHABOL (LATE ORDER)'}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div style="flex: 1; border: 1px solid black; padding: 15px; position: relative;">
                        <div style="position: absolute; top: -10px; left: 10px; background: white; padding: 0 5px;">
                            <h4 style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Customer Information</h4>
                        </div>
                        <div style="margin-top: 5px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px; width: 30%;"><strong>Name:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${orderForm.customer.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Email:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${orderForm.customer.email || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Contact:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${orderForm.customer.contact}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 20px; border: 1px solid black; padding: 15px; position: relative;">
                    <div style="position: absolute; top: -10px; left: 10px; background: white; padding: 0 5px;">
                        <h4 style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order Items</h4>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                        <thead>
                            <tr style="border-bottom: 1.5px solid black;">
                                <th style="padding: 5px; text-align: left; font-size: 11px; width: 40%;">Item</th>
                                <th style="padding: 5px; text-align: right; font-size: 11px; width: 20%;">Price/Unit</th>
                                <th style="padding: 5px; text-align: right; font-size: 11px; width: 20%;">Quantity</th>
                                <th style="padding: 5px; text-align: right; font-size: 11px; width: 20%;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderForm.sublimationOrders.map(order => `
                                <tr style="border-bottom: 0.5px solid #ddd;">
                                    <td style="padding: 5px; font-size: 11px;">${order.type || 'Not specified'}</td>
                                    <td style="padding: 5px; text-align: right; font-size: 11px;">₱${order.pricePerUnit.toFixed(2)}</td>
                                    <td style="padding: 5px; text-align: right; font-size: 11px;">${order.quantity}</td>
                                    <td style="padding: 5px; text-align: right; font-size: 11px;">₱${order.totalPrice.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" style="padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">Subtotal:</td>
                                <td style="padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">₱${orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">Discount (${orderForm.discountPercentage}%):</td>
                                <td style="padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">₱${(orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) * orderForm.discountPercentage / 100).toFixed(2)}</td>
                            </tr>
                            <tr style="border-top: 1px solid black;">
                                <td colspan="3" style="padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">Total After Discount:</td>
                                <td style="padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">₱${(orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) - (orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) * orderForm.discountPercentage / 100)).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">Deposit Amount:</td>
                                <td style="padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">₱${orderForm.deposit.toFixed(2)}</td>
                            </tr>
                            <tr style="background-color: #f5f5f5;">
                                <td colspan="3" style="padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">Remaining Balance:</td>
                                <td style="padding: 5px; text-align: right; font-weight: bold; font-size: 11px;">₱${((orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) - (orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) * orderForm.discountPercentage / 100)) - orderForm.deposit).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div style="display: flex; gap: 20px; margin-top: 20px;">
                    <div style="flex: 1; border: 1px solid black; padding: 15px; position: relative;">
                        <div style="position: absolute; top: -10px; left: 10px; background: white; padding: 0 5px;">
                            <h4 style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Notes</h4>
                        </div>
                        <div style="margin-top: 5px;">
                            <p style="font-size: 11px; margin: 0 0 5px;">• Please check all the details before confirming.</p>
                            <p style="font-size: 11px; margin: 0 0 5px;">• 50% down payment is required to start the order.</p>
                            <p style="font-size: 11px; margin: 0;">• Full payment is required upon pickup.</p>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 30px; border-top: 1px solid black; padding-top: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                        <div style="border: 1px solid black; padding: 5px 10px;">
                            <p style="margin: 0; font-size: 11px;"><strong>Layout Artist:</strong> ${user?.name}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin: 0; font-size: 10px; font-style: italic;">This is a computer-generated document.</p>
                            <p style="margin: 3px 0 0; font-size: 10px; font-style: italic;">No signature required.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(printContent);
        window.print();
        document.body.removeChild(printContent);
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ 
                        position: 'relative',
                        '&::before': { display: 'none' },
                        '&::after': { display: 'none' },
                    }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: -40,
                                width: '4px',
                                height: '100%',
                                transform: 'translateX(-50%)',
                                overflow: 'hidden'
                            }}
                        >
                            <motion.div
                                variants={fluidVariants}
                                initial="initial"
                                animate="animate"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    borderRadius: '4px',
                                    animation: 'gradient 3s ease infinite',
                                }}
                            />
                        </Box>
                        <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <Grid container spacing={3} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <motion.div variants={fieldVariants}>
                                        <TextField
                                            fullWidth
                                            label="Job Order Number"
                                            value={orderNumber}
                                            disabled
                                            sx={{
                                                ...commonFieldStyles,
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                    WebkitTextFillColor: 'text.primary',
                                                    fontSize: '1.1rem'
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BadgeIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <motion.div variants={fieldVariants}>
                                        <TextField
                                            fullWidth
                                            label="Job Serial Number"
                                            value={jobSerial}
                                            disabled
                                            sx={{
                                                ...commonFieldStyles,
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                    WebkitTextFillColor: 'text.primary',
                                                    fontSize: '1.1rem'
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocalOfferIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <motion.div variants={fieldVariants}>
                                        <TextField
                                            fullWidth
                                            label="Order Type"
                                            select
                                            value={orderForm.type}
                                            onChange={(e) => setOrderForm(prev => ({ ...prev, type: e.target.value }))}
                                            sx={commonFieldStyles}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CategoryIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        >
                                            <MenuItem value="NEW">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AddIcon sx={{ fontSize: '1.2rem' }} />
                                                    <span>New Order</span>
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="PAHABOL">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AlarmIcon sx={{ fontSize: '1.2rem' }} />
                                                    <span>PAHABOL (LATE ORDER)</span>
                                                </Box>
                                            </MenuItem>
                                        </TextField>
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <motion.div variants={fieldVariants}>
                                        <TextField
                                            fullWidth
                                            label="Order Deadline"
                                            type="date"
                                            value={orderForm.deadline}
                                            onChange={(e) => setOrderForm(prev => ({ ...prev, deadline: e.target.value }))}
                                            InputLabelProps={{ shrink: true }}
                                            sx={commonFieldStyles}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EventIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </motion.div>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ 
                        position: 'relative',
                        '&::before': { display: 'none' },
                        '&::after': { display: 'none' },
                    }}>
                        <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <Grid container spacing={3} sx={{ mb: 2 }}>
                                <Grid item xs={12}>
                                    <motion.div variants={fieldVariants}>
                                        <TextField
                                            fullWidth
                                            label="Customer Name"
                                            value={orderForm.customer.name}
                                            onChange={handleCustomerChange('name')}
                                            placeholder="Enter customer's full name"
                                            sx={commonFieldStyles}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <motion.div variants={fieldVariants}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            type="email"
                                            value={orderForm.customer.email}
                                            onChange={handleCustomerChange('email')}
                                            placeholder="customer@example.com"
                                            sx={commonFieldStyles}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <motion.div variants={fieldVariants}>
                                        <TextField
                                            fullWidth
                                            label="Contact Number"
                                            value={orderForm.customer.contact}
                                            onChange={handleCustomerChange('contact')}
                                            placeholder="Enter contact number"
                                            sx={commonFieldStyles}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </motion.div>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ 
                        position: 'relative',
                        '&::before': { display: 'none' },
                        '&::after': { display: 'none' },
                    }}>
                        <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{ 
                                    p: 3,
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        mb: 3
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ShoppingCartIcon sx={{ color: 'primary.main' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                Sublimation Orders
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            onClick={addSublimationOrder}
                                            startIcon={<AddIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
                                                },
                                                borderRadius: 2,
                                                px: 3
                                            }}
                                        >
                                            Add Item
                                        </Button>
                                    </Box>
                                    <TableContainer sx={{ 
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        '&::-webkit-scrollbar': {
                                            width: '8px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: '#f1f1f1',
                                            borderRadius: '4px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: '#888',
                                            borderRadius: '4px',
                                            '&:hover': {
                                                background: '#555',
                                            },
                                        },
                                    }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ 
                                                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                                }}>
                                                    <TableCell width="35%" sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        color: 'text.primary',
                                                        borderBottom: '2px solid',
                                                        borderColor: 'primary.main',
                                                    }}>
                                                        Type
                                                    </TableCell>
                                                    <TableCell width="20%" align="right" sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        color: 'text.primary',
                                                        borderBottom: '2px solid',
                                                        borderColor: 'primary.main',
                                                    }}>
                                                        Price/Unit
                                                    </TableCell>
                                                    <TableCell width="20%" align="right" sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        color: 'text.primary',
                                                        borderBottom: '2px solid',
                                                        borderColor: 'primary.main',
                                                    }}>
                                                        Quantity
                                                    </TableCell>
                                                    <TableCell width="20%" align="right" sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        color: 'text.primary',
                                                        borderBottom: '2px solid',
                                                        borderColor: 'primary.main',
                                                    }}>
                                                        Total
                                                    </TableCell>
                                                    <TableCell width="5%" align="center" sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        color: 'text.primary',
                                                        borderBottom: '2px solid',
                                                        borderColor: 'primary.main',
                                                    }}>
                                                        Actions
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orderForm.sublimationOrders.map((order, index) => (
                                                    <TableRow 
                                                        key={order.id}
                                                        sx={{ 
                                                            transition: 'all 0.2s',
                                                            '&:nth-of-type(odd)': {
                                                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                            },
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <TextField
                                                                select
                                                                fullWidth
                                                                size="small"
                                                                value={order.type}
                                                                onChange={(e) => handleSublimationTypeChange(index, e.target.value)}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderRadius: 2,
                                                                        transition: 'all 0.2s',
                                                                        '&:hover': {
                                                                            borderColor: 'primary.main',
                                                                        },
                                                                    },
                                                                }}
                                                            >
                                                                <MenuItem value="">Select Type</MenuItem>
                                                                {sublimationTypes.map((type) => (
                                                                    <MenuItem 
                                                                        key={type.id} 
                                                                        value={type.type}
                                                                        sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 1
                                                                        }}
                                                                    >
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <CategoryIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                                                            <span>{type.type}</span>
                                                                        </Box>
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography sx={{ 
                                                                fontWeight: 600,
                                                                color: 'primary.main',
                                                                fontSize: '1rem'
                                                            }}>
                                                                ₱{order.pricePerUnit.toFixed(2)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={order.quantity}
                                                                onChange={handleSublimationChange(index, 'quantity')}
                                                                sx={{
                                                                    width: '100px',
                                                                    '& input': { textAlign: 'right' },
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderRadius: 2,
                                                                        transition: 'all 0.2s',
                                                                        '&:hover': {
                                                                            borderColor: 'primary.main',
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography sx={{ 
                                                                fontWeight: 600,
                                                                color: 'primary.main',
                                                                fontSize: '1rem'
                                                            }}>
                                                                ₱{order.totalPrice.toFixed(2)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <IconButton
                                                                onClick={() => removeSublimationOrder(index)}
                                                                size="small"
                                                                sx={{
                                                                    color: 'error.main',
                                                                    '&:hover': {
                                                                        bgcolor: 'error.lighter',
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow sx={{ 
                                                    bgcolor: 'grey.50',
                                                    borderTop: '2px solid',
                                                    borderColor: 'primary.main',
                                                }}>
                                                    <TableCell colSpan={3} align="right" sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: '1rem',
                                                    }}>
                                                        Total Amount:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: '1.1rem',
                                                        color: 'primary.main',
                                                    }}>
                                                        ₱{orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell />
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        </motion.div>
                    </Box>
                );
            default:
                return <div>Not Found</div>;
        }
    };

    const stepContainerVariants = {
        initial: { 
            opacity: 0,
            scale: 0.9,
            y: 20
        },
        animate: { 
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: -20,
            transition: {
                duration: 0.3
            }
        }
    };

    // Add keyframe animation for gradient
    const GlobalStyles = styled('style')({
        '@keyframes gradient': {
            '0%': {
                backgroundPosition: '0% 0%'
            },
            '50%': {
                backgroundPosition: '0% 100%'
            },
            '100%': {
                backgroundPosition: '0% 0%'
            }
        }
    });

    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
    };

    const handleConfirmSubmit = async () => {
        handleCloseConfirmDialog();
        await handleSubmit();
    };

    const handleClear = () => {
        setOrderForm({
            customer: {
                name: '',
                email: '',
                contact: ''
            },
            deadline: format(new Date(), 'yyyy-MM-dd'),
            type: 'NEW',
            deposit: 0,
            discountPercentage: 0,
            sublimationOrders: [
                {
                    id: uuidv4(),
                    type: '',
                    pricePerUnit: 0,
                    quantity: 1,
                    totalPrice: 0
                }
            ]
        });
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <GlobalStyles />
            {loading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            <Box sx={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative',
                '& .MuiStep-root': {
                    '&::before': {
                        display: 'none'
                    },
                    '&::after': {
                        display: 'none'
                    }
                }
            }}>
                <Stepper 
                    activeStep={activeStep} 
                    alternativeLabel
                    connector={<CustomStepConnector />}
                    sx={{ 
                        pt: 3, 
                        pb: 5,
                        position: 'relative',
                        '& .MuiStepLabel-label': {
                            mt: 1,
                            fontSize: '1rem',
                            fontWeight: 500,
                        },
                        '& .MuiStepConnector-line': {
                            height: 3,
                            border: 0,
                            borderRadius: 1,
                            transition: 'all 0.5s ease-in-out',
                        }
                    }}
                >
                    {steps.map((step, index) => (
                        <Step 
                            key={step.label}
                            sx={{
                                '&::before': {
                                    display: 'none'
                                },
                                '&::after': {
                                    display: 'none'
                                }
                            }}
                        >
                            <StepLabel StepIconComponent={CustomStepIcon}>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        color: activeStep >= index ? '#4caf50' : 'text.primary',
                                        scale: activeStep === index ? 1.1 : 1
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {step.label}
                                </motion.div>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep}
                        variants={stepContainerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ position: 'relative' }}
                    >
                        <Box sx={{ 
                            position: 'relative',
                            '&::before': { display: 'none' },
                            '&::after': { display: 'none' },
                        }}>
                            {getStepContent(activeStep)}
                        </Box>
                    </motion.div>
                </AnimatePresence>

                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={handleClear}
                            sx={{
                                background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                                border: 0,
                                borderRadius: 2,
                                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                                color: 'white',
                                height: 48,
                                padding: '0 30px',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
                                    boxShadow: '0 4px 6px 2px rgba(255, 105, 135, .4)',
                                    transform: 'translateY(-1px)'
                                }
                            }}
                            startIcon={<ClearIcon />}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                border: 0,
                                borderRadius: 2,
                                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                color: 'white',
                                height: 48,
                                padding: '0 30px',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                                    boxShadow: '0 4px 6px 2px rgba(33, 203, 243, .4)',
                                    transform: 'translateY(-1px)'
                                }
                            }}
                            startIcon={<NavigateNextIcon />}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCloseConfirmDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 3,
                        '& .MuiTypography-root': {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            letterSpacing: 1,
                        }
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <ReceiptLongIcon sx={{ fontSize: '2rem' }} />
                            Order Confirmation
                        </Box>
                        <Typography variant="caption" sx={{ 
                            bgcolor: 'primary.main',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.9rem'
                        }}>
                            {orderNumber}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ mt: 3, px: 4 }}>
                    <Grid container spacing={4}>
                        {/* Order Information */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ 
                                p: 3, 
                                height: '100%',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                            }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1, 
                                    mb: 2,
                                    color: 'primary.main'
                                }}>
                                    <BadgeIcon />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Order Details
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalOfferIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                        <Typography><strong>Job Serial:</strong> {jobSerial}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CategoryIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                        <Typography>
                                            <strong>Type:</strong> {orderForm.type === 'NEW' ? 'New Order' : 'PAHABOL (LATE ORDER)'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EventIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                        <Typography>
                                            <strong>Deadline:</strong> {format(new Date(orderForm.deadline), 'MMMM dd, yyyy')}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BrushIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                        <Typography><strong>Layout Artist:</strong> {user?.name}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <MonetizationOnIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                        <Typography>
                                            <strong>Deposit Amount:</strong> ₱{orderForm.deposit.toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PaidIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                        <Typography>
                                            <strong>Total Amount:</strong> ₱{orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccountBalanceWalletIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                        <Typography>
                                            <strong>Remaining Balance:</strong> ₱{(orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) - orderForm.deposit).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Customer Information */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ 
                                p: 3, 
                                height: '100%',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                            }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1, 
                                    mb: 2,
                                    color: 'primary.main'
                                }}>
                                    <PersonIcon />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Customer Details
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                        <Typography><strong>Name:</strong> {orderForm.customer.name}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EmailIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                        <Typography><strong>Email:</strong> {orderForm.customer.email || 'N/A'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PhoneIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                        <Typography><strong>Contact:</strong> {orderForm.customer.contact}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Sublimation Orders */}
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ 
                                p: 3,
                                background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                            }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    mb: 2,
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ShoppingCartIcon sx={{ color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            Order Items
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{ 
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end',
                                            gap: 1
                                        }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Deposit Amount"
                                                        type="number"
                                                        value={orderForm.deposit}
                                                        onChange={(e) => setOrderForm(prev => ({
                                                            ...prev,
                                                            deposit: Math.max(0, Number(e.target.value))
                                                        }))}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                                                        }}
                                                        sx={{
                                                            '& input': { textAlign: 'right' }
                                                        }}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Discount Percentage"
                                                        type="number"
                                                        value={orderForm.discountPercentage}
                                                        onChange={(e) => setOrderForm(prev => ({
                                                            ...prev,
                                                            discountPercentage: Math.max(0, Math.min(100, Number(e.target.value)))
                                                        }))}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                            inputProps: { min: 0, max: 100 }
                                                        }}
                                                        sx={{
                                                            '& input': { textAlign: 'right' }
                                                        }}
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'flex-end',
                                                gap: 0.5
                                            }}>
                                                <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                                    Total: ₱{orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                                                </Typography>
                                                <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                                    Discount: {orderForm.discountPercentage}%
                                                </Typography>
                                                <Typography sx={{ 
                                                    color: 'primary.main', 
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem'
                                                }}>
                                                    Total After Discount: ₱{(orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) - (orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) * orderForm.discountPercentage / 100)).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <TableContainer>
                                    <Table size="medium">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>Type</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Price/Unit</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Quantity</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orderForm.sublimationOrders.map((order, index) => (
                                                <TableRow 
                                                    key={order.id}
                                                    sx={{ 
                                                        '&:nth-of-type(odd)': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                        },
                                                    }}
                                                >
                                                    <TableCell sx={{ fontSize: '0.95rem' }}>{order.type}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '0.95rem' }}>₱{order.pricePerUnit.toFixed(2)}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '0.95rem' }}>{order.quantity}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '0.95rem' }}>₱{order.totalPrice.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={3} align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Total Amount:</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1.1rem', color: 'primary.main' }}>₱{orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={3} align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Discount ({orderForm.discountPercentage}%):</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1.1rem', color: 'primary.main' }}>₱{(orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) * orderForm.discountPercentage / 100).toFixed(2)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={3} align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Total After Discount:</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1.1rem', color: 'primary.main' }}>₱{(orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) - (orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) * orderForm.discountPercentage / 100)).toFixed(2)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={3} align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>Deposit Amount:</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1.1rem', color: 'primary.main' }}>₱{orderForm.deposit.toFixed(2)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={3} align="right" sx={{ fontWeight: 600, fontSize: '1rem', backgroundColor: '#f5f5f5' }}>Remaining Balance:</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1.1rem', color: 'primary.main', backgroundColor: '#f5f5f5' }}>₱{((orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) - (orderForm.sublimationOrders.reduce((sum, order) => sum + order.totalPrice, 0) * orderForm.discountPercentage / 100)) - orderForm.deposit).toFixed(2)}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ 
                    p: 3, 
                    bgcolor: 'background.paper',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    gap: 2,
                    justifyContent: 'flex-end'
                }}>
                    <Button 
                        onClick={handleCloseConfirmDialog} 
                        variant="outlined"
                        color="inherit"
                        startIcon={<CloseIcon />}
                        sx={{ 
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePrint}
                        variant="outlined"
                        color="primary"
                        startIcon={<PrintIcon />}
                        sx={{ 
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Print
                    </Button>
                    <Button
                        onClick={handleConfirmSubmit}
                        variant="contained"
                        color="primary"
                        startIcon={<CheckIcon />}
                        sx={{ 
                            borderRadius: 2,
                            px: 4,
                            background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
                            }
                        }}
                    >
                        Submit Order
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Existing Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    variant="filled" 
                    severity={snackbar.severity} 
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Success Snackbar */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    variant="filled" 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    Order submitted successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateOrder;
