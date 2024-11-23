import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Grid,
    Divider,
    Tooltip,
    Stack,
    Avatar,
    Chip,
    DialogActions,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    IconButton as MuiIconButton,
    Snackbar,
    Alert
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PaymentIcon from '@mui/icons-material/Payment';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns';

interface Order {
    jobOrderNumber: string;
    serialJobNumber: string;
    customerName: string;
    status: string;
    orderType: string;
    deadline: string;
    billingStatus: string;
    totalAmount: number;
    depositAmount: number;
    balance: number;
    customerDetails: {
        name: string;
        email: string;
        contact: string;
    };
    orderDetails: {
        type: string;
        layoutArtist: string;
        dateOfOrder: string;
        sublimationOrders: Array<{
            type: string;
            pricePerUnit: number;
            quantity: number;
            totalPrice: number;
        }>;
    };
    cancelReason?: string;
    movedToHistory?: boolean;
}

interface SublimationType {
    type: string;
    price: number;
}

const sublimationTypes: SublimationType[] = [
    { type: 'Shirt', price: 350 },
    { type: 'Jersey', price: 450 },
    { type: 'Jacket', price: 550 },
    { type: 'ID Lace', price: 50 },
    { type: 'Mug', price: 150 },
    { type: 'Cap', price: 250 }
];

const OrderTracking: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);   // Add loading state
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [depositDialogOpen, setDepositDialogOpen] = useState(false);
    const [newDeposit, setNewDeposit] = useState<string>('');
    const [depositError, setDepositError] = useState('');
    const [editOrderDialogOpen, setEditOrderDialogOpen] = useState(false);
    const [editedOrders, setEditedOrders] = useState<Array<{
        id: string;
        type: string;
        pricePerUnit: number;
        quantity: number;
        totalPrice: number;
    }>>([]);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        try {
            // Fetch orders from localStorage
            const storedOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
            // Filter out orders that should be in history (Done + Paid, or Cancelled)
            const activeOrders = storedOrders.filter((order: Order) => 
                !(order.status === 'Done' && order.billingStatus === 'Paid') && 
                order.status !== 'Cancelled' &&
                !order.movedToHistory
            );
            setOrders(activeOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
            setOrders([]); // Set to empty array in case of error
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
        setSelectedOrder(null);
    };

    const handlePrintInvoice = (order: Order) => {
        const printContent = document.createElement('div');
        printContent.className = 'print-only';
        printContent.innerHTML = `
            <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 8.5in; margin: 0 auto; position: relative; background: white;">
                <div style="text-align: center; margin-bottom: 30px; position: relative;">
                    <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: black; padding: 4px 15px; border-radius: 0 0 8px 8px;">
                        <h3 style="margin: 0; color: white; font-size: 12px; letter-spacing: 1px;">PHASE 2 INVOICE</h3>
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
                                    <td style="padding: 3px 0; font-size: 11px;">${order.serialJobNumber}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Job Serial:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${order.jobOrderNumber}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Date:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${format(new Date(order.orderDetails.dateOfOrder), 'MMMM dd, yyyy')}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Deadline:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${order.deadline ? format(new Date(order.deadline), 'MMMM dd, yyyy') : 'Not set'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Order Type:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${order.orderType === 'NEW' ? 'New Order' : 'PAHABOL (LATE ORDER)'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Layout Artist:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${order.orderDetails.layoutArtist || 'Not assigned'}</td>
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
                                    <td style="padding: 3px 0; font-size: 11px; width: 40%;"><strong>Name:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${order.customerDetails.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Email:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${order.customerDetails.email || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Contact:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">${order.customerDetails.contact}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

                <div style="border: 1px solid black; padding: 15px; margin-bottom: 20px; position: relative;">
                    <div style="position: absolute; top: -10px; left: 10px; background: white; padding: 0 5px;">
                        <h4 style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order Details</h4>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ddd; padding: 8px; font-size: 11px; text-align: left; background-color: #f5f5f5;">Item</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-size: 11px; text-align: right; background-color: #f5f5f5;">Price/Unit</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-size: 11px; text-align: right; background-color: #f5f5f5;">Quantity</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-size: 11px; text-align: right; background-color: #f5f5f5;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.orderDetails.sublimationOrders.map(item => `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 11px;">${item.type}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 11px; text-align: right;">₱${item.pricePerUnit.toFixed(2)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 11px; text-align: right;">${item.quantity}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; font-size: 11px; text-align: right;">₱${item.totalPrice.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; gap: 20px;">
                    <div style="flex: 1; border: 1px solid black; padding: 15px; position: relative;">
                        <div style="position: absolute; top: -10px; left: 10px; background: white; padding: 0 5px;">
                            <h4 style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Details</h4>
                        </div>
                        <div style="margin-top: 5px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px; width: 40%;"><strong>Total Amount:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">₱${order.totalAmount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Deposit:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">₱${order.depositAmount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-size: 11px;"><strong>Balance:</strong></td>
                                    <td style="padding: 3px 0; font-size: 11px;">₱${order.balance.toFixed(2)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

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
            </div>
        `;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Invoice</title>
                        <style>
                            @media print {
                                body { margin: 0; }
                                .print-only { display: block; }
                            }
                        </style>
                    </head>
                    <body>
                        ${printContent.innerHTML}
                        <script>
                            window.onload = function() {
                                window.print();
                                window.onafterprint = function() {
                                    window.close();
                                };
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'warning';
            case 'on process':
                return 'info';
            case 'done':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getBillingStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'success';
            case 'partially paid':
                return 'warning';
            case 'unpaid':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return format(new Date(date), 'MMMM dd, yyyy');
    };

    const handleStatusChange = () => {
        if (selectedOrder && newStatus) {
            const updatedOrder = {
                ...selectedOrder,
                status: newStatus
            };

            // Check if order should move to history - only if status is Done AND balance is fully paid
            const shouldMoveToHistory = 
                (newStatus === 'Done' && updatedOrder.billingStatus === 'Paid') || 
                newStatus === 'Cancelled';

            // If trying to move to Done status but balance is not paid, show error
            if (newStatus === 'Done' && updatedOrder.billingStatus !== 'Paid') {
                setSnackbar({
                    open: true,
                    message: 'Cannot mark order as Done. Order must be fully paid first.',
                    severity: 'error'
                });
                setStatusDialogOpen(false);
                setNewStatus('');
                return;
            }

            // Update all orders
            const updatedOrders = orders.map(order => 
                order.serialJobNumber === selectedOrder.serialJobNumber
                    ? updatedOrder
                    : order
            );

            // If order should move to history, remove it from active orders
            const filteredOrders = shouldMoveToHistory 
                ? updatedOrders.filter(order => order.serialJobNumber !== selectedOrder.serialJobNumber)
                : updatedOrders;

            // Update local state
            setOrders(filteredOrders);
            setSelectedOrder(updatedOrder);

            // Update localStorage with ALL orders (including history)
            const allStoredOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
            const updatedStoredOrders = allStoredOrders.map(order =>
                order.serialJobNumber === selectedOrder.serialJobNumber
                    ? { ...updatedOrder, movedToHistory: shouldMoveToHistory }
                    : order
            );
            localStorage.setItem('orders', JSON.stringify(updatedStoredOrders));

            // Dispatch custom event to notify OrderHistory
            window.dispatchEvent(new Event('ordersUpdated'));

            // Close the status dialog
            setStatusDialogOpen(false);
            setNewStatus('');

            // Show success message
            setSnackbar({
                open: true,
                message: shouldMoveToHistory 
                    ? 'Order has been moved to history'
                    : 'Order status has been updated',
                severity: 'success'
            });

            // If moved to history, close the view dialog
            if (shouldMoveToHistory) {
                handleCloseViewDialog();
            }
        }
    };

    const handleOpenStatusDialog = () => {
        if (selectedOrder) {
            setNewStatus(selectedOrder.status);
            setStatusDialogOpen(true);
        }
    };

    const handleCloseStatusDialog = () => {
        setStatusDialogOpen(false);
        setNewStatus('');
    };

    const handleOpenDepositDialog = () => {
        if (selectedOrder) {
            setNewDeposit('');
            setDepositError('');
            setDepositDialogOpen(true);
        }
    };

    const handleCloseDepositDialog = () => {
        setDepositDialogOpen(false);
        setNewDeposit('');
        setDepositError('');
    };

    const handleDepositChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setNewDeposit(value);
            setDepositError('');
        }
    };

    const handleUpdateBillingStatus = () => {
        if (selectedOrder && !depositError) {
            const newTotalDeposit = parseFloat(newDeposit) + selectedOrder.depositAmount;
            const newBalance = selectedOrder.totalAmount - newTotalDeposit;
            const newBillingStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';

            const updatedOrder = {
                ...selectedOrder,
                depositAmount: newTotalDeposit,
                balance: newBalance,
                billingStatus: newBillingStatus
            };

            // Check if order should move to history (Done + Paid)
            const shouldMoveToHistory = updatedOrder.status === 'Done' && newBillingStatus === 'Paid';

            // If order should move to history, remove it from active orders
            const filteredOrders = shouldMoveToHistory 
                ? orders.filter(order => 
                    order.serialJobNumber !== selectedOrder.serialJobNumber
                )
                : orders;

            // Update local state based on whether the order should move to history
            if (shouldMoveToHistory) {
                setOrders(filteredOrders);
            } else {
                setOrders(orders.map(order =>
                    order.serialJobNumber === selectedOrder.serialJobNumber
                        ? updatedOrder
                        : order
                ));
            }
            setSelectedOrder(updatedOrder);

            // Update localStorage with ALL orders
            const allStoredOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
            const updatedStoredOrders = allStoredOrders.map(order =>
                order.serialJobNumber === selectedOrder.serialJobNumber
                    ? updatedOrder
                    : order
            );
            localStorage.setItem('orders', JSON.stringify(updatedStoredOrders));

            // Dispatch custom event to notify OrderHistory
            window.dispatchEvent(new Event('ordersUpdated'));

            // Close deposit dialog
            setDepositDialogOpen(false);
            setNewDeposit('');
            setDepositError('');

            // If moved to history, close the view dialog
            if (shouldMoveToHistory) {
                handleCloseViewDialog();
            }
        }
    };

    const handleOpenEditOrder = () => {
        if (selectedOrder) {
            const orders = selectedOrder.orderDetails?.sublimationOrders || [];
            setEditedOrders(orders.map(order => ({
                ...order,
                id: Math.random().toString(36).substr(2, 9)
            })));
            setEditOrderDialogOpen(true);
        }
    };

    const handleCloseEditOrder = () => {
        setEditOrderDialogOpen(false);
        setEditedOrders([]);
    };

    const handleAddNewOrder = () => {
        setEditedOrders([
            ...editedOrders,
            {
                id: Math.random().toString(36).substr(2, 9),
                type: '',
                pricePerUnit: 0,
                quantity: 1,
                totalPrice: 0
            }
        ]);
    };

    const handleOrderTypeChange = (id: string, newType: string) => {
        setEditedOrders(editedOrders.map(order => {
            if (order.id === id) {
                const selectedType = sublimationTypes.find(type => type.type === newType);
                const pricePerUnit = selectedType ? selectedType.price : 0;
                return {
                    ...order,
                    type: newType,
                    pricePerUnit: pricePerUnit,
                    totalPrice: pricePerUnit * order.quantity
                };
            }
            return order;
        }));
    };

    const handleQuantityChange = (id: string, newQuantity: string) => {
        const quantity = parseInt(newQuantity);
        if (!isNaN(quantity) && quantity > 0) {
            setEditedOrders(editedOrders.map(order => {
                if (order.id === id) {
                    return {
                        ...order,
                        quantity: quantity,
                        totalPrice: order.pricePerUnit * quantity
                    };
                }
                return order;
            }));
        }
    };

    const handleDeleteOrder = (id: string) => {
        setEditedOrders(editedOrders.filter(order => order.id !== id));
    };

    const handleSaveOrders = () => {
        if (selectedOrder) {
            // Calculate new total amount
            const newTotalAmount = editedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
            
            // Calculate new balance (subtract existing deposits from new total)
            const newBalance = newTotalAmount - selectedOrder.depositAmount;
            
            // Determine new billing status based on deposits and new balance
            const newBillingStatus = newBalance <= 0 ? 'Paid' : 
                                   selectedOrder.depositAmount > 0 ? 'Partially Paid' : 'Unpaid';

            const updatedOrder = {
                ...selectedOrder,
                totalAmount: newTotalAmount,
                balance: newBalance,
                billingStatus: newBillingStatus,
                orderDetails: {
                    ...selectedOrder.orderDetails,
                    sublimationOrders: editedOrders
                }
            };

            // Update orders array
            const updatedOrders = orders.map(order =>
                order.serialJobNumber === selectedOrder.serialJobNumber
                    ? updatedOrder
                    : order
            );

            // Update state and localStorage
            setOrders(updatedOrders);
            setSelectedOrder(updatedOrder);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));

            // Dispatch custom event to notify OrderHistory
            window.dispatchEvent(new Event('ordersUpdated'));

            // Close dialog
            handleCloseEditOrder();
        }
    };

    const handleOpenCancelDialog = () => {
        if (selectedOrder) {
            setCancelReason('');
            setCancelError('');
            setCancelDialogOpen(true);
        }
    };

    const handleCloseCancelDialog = () => {
        setCancelDialogOpen(false);
        setCancelReason('');
        setCancelError('');
    };

    const handleCancelOrder = () => {
        if (!cancelReason.trim()) {
            setCancelError('Please provide a reason for cancellation');
            return;
        }

        if (selectedOrder) {
            const updatedOrder = {
                ...selectedOrder,
                status: 'Cancelled',
                cancelReason: cancelReason
            };

            // Update all orders and remove cancelled order from active orders
            const updatedOrders = orders.filter(order => 
                order.serialJobNumber !== selectedOrder.serialJobNumber
            );

            // Update local state
            setOrders(updatedOrders);
            setSelectedOrder(updatedOrder);

            // Update localStorage with ALL orders
            const allStoredOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
            const updatedStoredOrders = allStoredOrders.map(order =>
                order.serialJobNumber === selectedOrder.serialJobNumber
                    ? updatedOrder
                    : order
            );
            localStorage.setItem('orders', JSON.stringify(updatedStoredOrders));

            // Dispatch custom event to notify OrderHistory
            window.dispatchEvent(new Event('ordersUpdated'));

            // Close the dialogs
            setCancelDialogOpen(false);
            setCancelReason('');
            setCancelError('');
            handleCloseViewDialog();
        }
    };

    const handleMoveToHistory = () => {
        if (!selectedOrder) return;

        // Add debug logging
        console.log('Current order status:', {
            status: selectedOrder.status,
            billingStatus: selectedOrder.billingStatus,
            isDone: selectedOrder.status.toUpperCase() === 'DONE',
            isPaid: selectedOrder.billingStatus.toUpperCase() === 'PAID'
        });

        // Check if order can be moved to history - using case-insensitive comparison
        if (selectedOrder.status.toUpperCase() !== 'DONE' || selectedOrder.billingStatus.toUpperCase() !== 'PAID') {
            setSnackbar({
                open: true,
                message: 'Order can only be moved to history when it is marked as Done and fully paid.',
                severity: 'error'
            });
            return;
        }

        // Update order in localStorage
        const allStoredOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedStoredOrders = allStoredOrders.map(order =>
            order.serialJobNumber === selectedOrder.serialJobNumber
                ? { ...order, movedToHistory: true }
                : order
        );
        localStorage.setItem('orders', JSON.stringify(updatedStoredOrders));

        // Update local state
        setOrders(orders.filter(order => order.serialJobNumber !== selectedOrder.serialJobNumber));

        // Show success message
        setSnackbar({
            open: true,
            message: 'Order has been moved to history',
            severity: 'success'
        });

        // Close the view dialog
        handleCloseViewDialog();

        // Dispatch event to notify OrderHistory component
        window.dispatchEvent(new Event('ordersUpdated'));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Order Tracking</Typography>
            <Box sx={{ 
                height: 'calc(100vh - 80px)', 
                overflow: 'auto',
                p: 2,
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
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>SERIAL JOB ORDER</TableCell>
                                <TableCell>JOB ORDER NUMBER</TableCell>
                                <TableCell>CUSTOMER NAME</TableCell>
                                <TableCell>STATUS</TableCell>
                                <TableCell>ORDER TYPE</TableCell>
                                <TableCell>DEADLINE</TableCell>
                                <TableCell>BILLING STATUS</TableCell>
                                <TableCell>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        Loading orders...
                                    </TableCell>
                                </TableRow>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <TableRow key={order.serialJobNumber} hover>
                                        <TableCell>{order.serialJobNumber}</TableCell>
                                        <TableCell>{order.jobOrderNumber}</TableCell>
                                        <TableCell>{order.customerName}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={order.status}
                                                color={getStatusColor(order.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{order.orderType}</TableCell>
                                        <TableCell>{order.deadline}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={order.billingStatus}
                                                color={getBillingStatusColor(order.billingStatus)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="View Order">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewOrder(order)}
                                                        sx={{ 
                                                            color: 'primary.main',
                                                            '&:hover': { 
                                                                backgroundColor: 'primary.light',
                                                                color: 'primary.dark'
                                                            }
                                                        }}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* View Order Dialog */}
            <Dialog 
                open={viewDialogOpen} 
                onClose={handleCloseViewDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                        boxShadow: '0 8px 40px -12px rgba(0,0,0,0.2)',
                        bgcolor: '#f8f9fa'
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        p: 0,
                        position: 'relative'
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseViewDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'grey.500',
                            zIndex: 1
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    {selectedOrder && (
                        <Box sx={{ p: 2 }}>
                            {/* Header */}
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: 'primary.main'
                                            }}
                                        >
                                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                                                IW
                                            </Typography>
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2 }}>
                                                IRONWOLF
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Digital Printing Solutions
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: { xs: 'flex-start', md: 'flex-end' },
                                    justifyContent: 'center'
                                }}>
                                    <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5, fontWeight: 600 }}>
                                        SERIAL JOB ORDER #{selectedOrder.serialJobNumber}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Order: {formatDate(selectedOrder.orderDetails.dateOfOrder)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Due: {selectedOrder.deadline}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Status Bar */}
                            <Box sx={{ 
                                mb: 2,
                                p: 1.5,
                                bgcolor: 'white',
                                borderRadius: 1,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip 
                                        label={selectedOrder.status}
                                        color={getStatusColor(selectedOrder.status)}
                                        size="small"
                                    />
                                    <Chip 
                                        label={selectedOrder.billingStatus}
                                        color={getBillingStatusColor(selectedOrder.billingStatus)}
                                        size="small"
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        sx={{ borderRadius: 1 }}
                                        onClick={handleOpenEditOrder}
                                    >
                                        Edit Order
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<TimelapseIcon />}
                                        sx={{ borderRadius: 1 }}
                                        onClick={handleOpenStatusDialog}
                                    >
                                        Change Status
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        color="success"
                                        sx={{ borderRadius: 1 }}
                                        onClick={handleOpenDepositDialog}
                                        disabled={selectedOrder.balance === 0}
                                    >
                                        Add Deposit
                                    </Button>
                                </Box>
                            </Box>

                            {/* Bill To and Payment Section */}
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={5}>
                                    <Box sx={{ 
                                        p: 1.5,
                                        bgcolor: 'white',
                                        borderRadius: 1,
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        height: '100%'
                                    }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            CUSTOMER DETAILS
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {selectedOrder.customerDetails.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <EmailIcon sx={{ fontSize: 16 }} /> {selectedOrder.customerDetails.email}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <PhoneIcon sx={{ fontSize: 16 }} /> {selectedOrder.customerDetails.contact}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Box sx={{ 
                                        p: 1.5,
                                        bgcolor: 'primary.main',
                                        borderRadius: 1,
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        color: 'white',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" sx={{ opacity: 0.8 }}>Total Amount</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {formatCurrency(selectedOrder.totalAmount)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" sx={{ opacity: 0.8 }}>Deposit</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {formatCurrency(selectedOrder.depositAmount)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" sx={{ opacity: 0.8 }}>Balance</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {formatCurrency(selectedOrder.balance)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Order Items */}
                            <TableContainer 
                                component={Paper} 
                                elevation={0} 
                                sx={{ 
                                    maxHeight: 'calc(100vh - 200px)',
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
                                }}
                            >
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                                            <TableCell sx={{ fontWeight: 600 }}>Item Description</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(selectedOrder && selectedOrder.orderDetails && selectedOrder.orderDetails.sublimationOrders) ? 
                                            selectedOrder.orderDetails.sublimationOrders.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.type}</TableCell>
                                                    <TableCell align="right">{formatCurrency(item.pricePerUnit)}</TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                    <TableCell align="right">{formatCurrency(item.totalPrice)}</TableCell>
                                                </TableRow>
                                            )) : 
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">No items found</TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                    onClick={() => selectedOrder && handlePrintInvoice(selectedOrder)}
                                    color="primary"
                                    variant="contained"
                                    startIcon={<LocalPrintshopIcon />}
                                >
                                    Print Invoice
                                </Button>
                                <Button
                                    onClick={handleMoveToHistory}
                                    color="secondary"
                                    variant="contained"
                                >
                                    Move to History
                                </Button>
                                <Button
                                    onClick={handleOpenCancelDialog}
                                    color="error"
                                    variant="contained"
                                >
                                    Cancel Order
                                </Button>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Status Change Dialog */}
            <Dialog 
                open={statusDialogOpen} 
                onClose={handleCloseStatusDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                        boxShadow: '0 8px 40px -12px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle>
                    Change Order Status
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseStatusDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'grey.500',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset" sx={{ width: '100%', mt: 1 }}>
                        <RadioGroup
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <FormControlLabel 
                                value="PENDING" 
                                control={<Radio />} 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip 
                                            label="PENDING"
                                            color="warning"
                                            size="small"
                                        />
                                        <Typography variant="body2">Order is waiting to be processed</Typography>
                                    </Box>
                                }
                            />
                            <FormControlLabel 
                                value="ON PROCESS" 
                                control={<Radio />} 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip 
                                            label="ON PROCESS"
                                            color="info"
                                            size="small"
                                        />
                                        <Typography variant="body2">Order is being processed</Typography>
                                    </Box>
                                }
                            />
                            <FormControlLabel 
                                value="DONE" 
                                control={<Radio />} 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip 
                                            label="DONE"
                                            color="success"
                                            size="small"
                                        />
                                        <Typography variant="body2">Order has been completed</Typography>
                                    </Box>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseStatusDialog}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleStatusChange}
                        disabled={!newStatus || newStatus === selectedOrder?.status}
                    >
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Deposit Dialog */}
            <Dialog
                open={depositDialogOpen}
                onClose={handleCloseDepositDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                        boxShadow: '0 8px 40px -12px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle>
                    Add Deposit
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDepositDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'grey.500',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Current Balance: {selectedOrder && formatCurrency(selectedOrder.balance)}
                        </Typography>
                        <TextField
                            fullWidth
                            label="Deposit Amount"
                            variant="outlined"
                            value={newDeposit}
                            onChange={handleDepositChange}
                            error={!!depositError}
                            helperText={depositError}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                            }}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDepositDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdateBillingStatus}
                        color="success"
                        disabled={!newDeposit || parseFloat(newDeposit) <= 0}
                    >
                        Add Deposit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Order Dialog */}
            <Dialog
                open={editOrderDialogOpen}
                onClose={handleCloseEditOrder}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                        boxShadow: '0 8px 40px -12px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle>
                    Edit Order
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseEditOrder}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'grey.500',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="right">Price/Unit</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Total Price</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {editedOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        value={order.type}
                                                        onChange={(e) => handleOrderTypeChange(order.id, e.target.value)}
                                                    >
                                                        {sublimationTypes.map((type) => (
                                                            <MenuItem key={type.type} value={type.type}>
                                                                {type.type}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="right">
                                                ₱{order.pricePerUnit.toLocaleString()}
                                            </TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    type="number"
                                                    value={order.quantity}
                                                    onChange={(e) => handleQuantityChange(order.id, e.target.value)}
                                                    size="small"
                                                    inputProps={{ min: 1 }}
                                                    sx={{ width: 80 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                ₱{order.totalPrice.toLocaleString()}
                                            </TableCell>
                                            <TableCell align="right">
                                                <MuiIconButton
                                                    size="small"
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    disabled={editedOrders.length === 1}
                                                >
                                                    <DeleteIcon />
                                                </MuiIconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddNewOrder}
                            >
                                Add Item
                            </Button>
                            <Typography variant="subtitle1">
                                Total Amount: ₱{editedOrders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseEditOrder}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveOrders}
                        color="primary"
                        disabled={editedOrders.some(order => !order.type || order.quantity < 1)}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Cancel Order Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={handleCloseCancelDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Cancel Order</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Reason for Cancellation"
                            multiline
                            rows={4}
                            value={cancelReason}
                            onChange={(e) => {
                                setCancelReason(e.target.value);
                                if (cancelError) setCancelError('');
                            }}
                            error={!!cancelError}
                            helperText={cancelError}
                            placeholder="Please provide a reason for cancelling this order..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseCancelDialog}>Back</Button>
                    <Button
                        variant="contained"
                        onClick={handleCancelOrder}
                        color="error"
                    >
                        Confirm Cancellation
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OrderTracking;
