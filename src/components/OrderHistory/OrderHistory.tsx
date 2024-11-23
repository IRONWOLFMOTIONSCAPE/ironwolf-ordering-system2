import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Divider
} from '@mui/material';
import { format } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';

interface SublimationOrder {
    type: string;
    pricePerUnit: number;
    quantity: number;
    totalPrice: number;
}

interface CustomerDetails {
    name: string;
    email: string;
    contact: string;
}

interface OrderDetails {
    dateOfOrder: string;
    sublimationOrders: SublimationOrder[];
    layoutArtist?: string;
}

interface Order {
    jobOrderNumber: string;
    serialJobNumber: string;
    customerName: string;
    status: string;
    billingStatus: string;
    orderType: string;
    deadline?: string;
    movedToHistory?: boolean;
    customerDetails: CustomerDetails;
    orderDetails: OrderDetails;
    totalAmount: number;
    depositAmount: number;
    balance: number;
}

const OrderHistory = () => {
    const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const loadCompletedOrders = () => {
        // Fetch orders from localStorage
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Filter orders that are either completed (Done + Paid) or manually moved
        const filteredOrders = allOrders.filter((order: Order) => 
            (order.status === 'Done' && order.billingStatus === 'Paid') || 
            order.movedToHistory === true
        );
        
        setCompletedOrders(filteredOrders);
    };

    useEffect(() => {
        // Initial load
        loadCompletedOrders();

        // Listen for localStorage changes
        const handleStorageChange = () => {
            loadCompletedOrders();
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Custom event listener for direct updates
        window.addEventListener('ordersUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('ordersUpdated', handleStorageChange);
        };
    }, []);

    const getStatusChip = (status: string) => {
        if (status === 'Cancelled') {
            return (
                <Chip
                    label="CANCELLED"
                    color="error"
                    size="small"
                    icon={<CancelIcon />}
                />
            );
        }
        return (
            <Chip
                label="ORDER COMPLETE"
                color="success"
                size="small"
                icon={<CheckCircleIcon />}
            />
        );
    };

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
            <div style="padding: 15px; font-family: Arial, sans-serif; max-width: 8.5in; height: 5.5in; margin: 0 auto; position: relative; background: white;">
                <div style="text-align: center; margin-bottom: 20px; position: relative;">
                    <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: black; padding: 4px 15px; border-radius: 0 0 8px 8px;">
                        <h3 style="margin: 0; color: white; font-size: 12px; letter-spacing: 1px;">FINAL PHASE INVOICE</h3>
                    </div>
                    <div style="border: 1.5px solid black; padding: 20px 15px 12px;">
                        <h1 style="font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 900;">IRONWOLF</h1>
                        <h2 style="font-size: 12px; margin: 3px 0; letter-spacing: 2px; text-transform: uppercase;">Digital Printing</h2>
                        <p style="font-size: 10px; margin: 3px 0; font-style: italic;">Professional Sublimation Printing Services</p>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                    <div style="flex: 1; border: 1px solid black; padding: 12px 10px 8px; position: relative;">
                        <div style="position: absolute; top: -7px; left: 8px; background: white; padding: 0 4px;">
                            <h4 style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Order Information</h4>
                        </div>
                        <div style="margin-top: 2px;">
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Job Order Number:</strong> ${order.jobOrderNumber}</p>
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Serial Job Order:</strong> ${order.serialJobNumber}</p>
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Date:</strong> ${format(new Date(order.orderDetails.dateOfOrder), 'MMMM dd, yyyy')}</p>
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Deadline:</strong> ${order.deadline ? format(new Date(order.deadline), 'MMMM dd, yyyy') : 'Not set'}</p>
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Order Type:</strong> ${order.orderType}</p>
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Layout Artist:</strong> ${order.orderDetails.layoutArtist || 'Not assigned'}</p>
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Total Amount:</strong> ₱${order.totalAmount.toLocaleString()}</p>
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Payment Status:</strong> <span style="color: #2e7d32; font-weight: bold;">PAID</span></p>
                        </div>
                    </div>

                    <div style="flex: 1; border: 1px solid black; padding: 12px 10px 8px; position: relative;">
                        <div style="position: absolute; top: -7px; left: 8px; background: white; padding: 0 4px;">
                            <h4 style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Customer Information</h4>
                        </div>
                        <div style="margin-top: 2px;">
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Name:</strong> ${order.customerDetails.name}</p>
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Email:</strong> ${order.customerDetails.email || 'N/A'}</p>
                            <p style="margin: 2px 0; font-size: 10px;"><strong>Contact:</strong> ${order.customerDetails.contact}</p>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 12px; border: 1px solid black; padding: 12px 10px 8px; position: relative;">
                    <div style="position: absolute; top: -7px; left: 8px; background: white; padding: 0 4px;">
                        <h4 style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Order Items</h4>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 3px;">
                        <thead>
                            <tr style="border-bottom: 1.5px solid black;">
                                <th style="padding: 4px; text-align: left; font-size: 10px; width: 40%; text-transform: uppercase;">Item</th>
                                <th style="padding: 4px; text-align: right; font-size: 10px; width: 20%; text-transform: uppercase;">Price/Unit</th>
                                <th style="padding: 4px; text-align: right; font-size: 10px; width: 20%; text-transform: uppercase;">Quantity</th>
                                <th style="padding: 4px; text-align: right; font-size: 10px; width: 20%; text-transform: uppercase;">Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.orderDetails.sublimationOrders.map(item => `
                                <tr style="border-bottom: 1px solid #eee;">
                                    <td style="padding: 4px; text-align: left; font-size: 10px;">${item.type}</td>
                                    <td style="padding: 4px; text-align: right; font-size: 10px;">₱${item.pricePerUnit.toLocaleString()}</td>
                                    <td style="padding: 4px; text-align: right; font-size: 10px;">${item.quantity}</td>
                                    <td style="padding: 4px; text-align: right; font-size: 10px;">₱${item.totalPrice.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                            <tr style="border-top: 2px solid black;">
                                <td colspan="3" style="padding: 4px; text-align: right; font-size: 10px;"><strong>Total Amount:</strong></td>
                                <td style="padding: 4px; text-align: right; font-size: 10px;"><strong>₱${order.totalAmount.toLocaleString()}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin-top: 20px; text-align: center; font-size: 10px; color: #666;">
                    <p style="margin: 2px 0;">Thank you for choosing IRONWOLF Digital Printing!</p>
                    <p style="margin: 2px 0;">For inquiries, please contact us at: (Contact Information)</p>
                </div>
            </div>
        `;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Invoice - ${order.serialJobNumber}</title>
                        <style>
                            @media print {
                                body { margin: 0; }
                                .print-only { display: block; }
                            }
                        </style>
                    </head>
                    <body>
                        ${printContent.outerHTML}
                        <script>
                            window.onload = function() {
                                window.print();
                                window.onafterprint = function() {
                                    window.close();
                                }
                            }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Order History
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>SERIAL JOB ORDER</TableCell>
                            <TableCell>JOB ORDER NUMBER</TableCell>
                            <TableCell>CUSTOMER NAME</TableCell>
                            <TableCell>DATE OF ACCOMPLISHMENT</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell align="center">ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {completedOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No completed orders</TableCell>
                            </TableRow>
                        ) : (
                            completedOrders.map((order) => (
                                <TableRow key={order.serialJobNumber}>
                                    <TableCell>{order.serialJobNumber}</TableCell>
                                    <TableCell>{order.jobOrderNumber}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>
                                        {format(new Date(order.orderDetails.dateOfOrder), 'MMMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusChip(order.status)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            onClick={() => handleViewOrder(order)}
                                            color="primary"
                                            size="small"
                                            title="View Order Details"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* View Order Details Dialog */}
            <Dialog 
                open={viewDialogOpen} 
                onClose={handleCloseViewDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Order Details
                </DialogTitle>
                <DialogContent dividers>
                    {selectedOrder && (
                        <Grid container spacing={3}>
                            {/* Order Information */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Order Information</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography><strong>Serial Job Order:</strong> {selectedOrder.serialJobNumber}</Typography>
                                    <Typography><strong>Job Order Number:</strong> {selectedOrder.jobOrderNumber}</Typography>
                                    <Typography>
                                        <strong>Date:</strong> {format(new Date(selectedOrder.orderDetails.dateOfOrder), 'MMMM dd, yyyy')}
                                    </Typography>
                                    <Typography>
                                        <strong>Deadline:</strong> {selectedOrder.deadline ? format(new Date(selectedOrder.deadline), 'MMMM dd, yyyy') : 'Not set'}
                                    </Typography>
                                    <Typography><strong>Order Type:</strong> {selectedOrder.orderType}</Typography>
                                    <Typography><strong>Status:</strong> {selectedOrder.status}</Typography>
                                    <Typography><strong>Billing Status:</strong> {selectedOrder.billingStatus}</Typography>
                                </Box>
                            </Grid>

                            {/* Customer Information */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography><strong>Name:</strong> {selectedOrder.customerDetails.name}</Typography>
                                    <Typography><strong>Email:</strong> {selectedOrder.customerDetails.email || 'N/A'}</Typography>
                                    <Typography><strong>Contact:</strong> {selectedOrder.customerDetails.contact}</Typography>
                                </Box>
                            </Grid>

                            {/* Financial Information */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>Financial Details</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography><strong>Total Amount:</strong> ₱{selectedOrder.totalAmount.toLocaleString()}</Typography>
                                    <Typography><strong>Deposit Amount:</strong> ₱{selectedOrder.depositAmount.toLocaleString()}</Typography>
                                    <Typography><strong>Balance:</strong> ₱{selectedOrder.balance.toLocaleString()}</Typography>
                                </Box>
                            </Grid>

                            {/* Order Items */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>Order Items</Typography>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Item</TableCell>
                                                <TableCell align="right">Price/Unit</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align="right">Total Price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.orderDetails.sublimationOrders.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.type}</TableCell>
                                                    <TableCell align="right">₱{item.pricePerUnit.toLocaleString()}</TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                    <TableCell align="right">₱{item.totalPrice.toLocaleString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => selectedOrder && handlePrintInvoice(selectedOrder)} 
                        variant="outlined" 
                        startIcon={<PrintIcon />}
                    >
                        Print Invoice
                    </Button>
                    <Button onClick={handleCloseViewDialog} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderHistory;
