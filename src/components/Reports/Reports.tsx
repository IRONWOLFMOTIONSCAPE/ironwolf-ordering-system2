import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    useTheme,
    alpha,
    FormControl,
    Select,
    MenuItem,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    Assessment as AssessmentIcon,
    LocalAtm as LocalAtmIcon,
    ShoppingCart as ShoppingCartIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Warning as WarningIcon,
    Cancel as CancelIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from 'recharts';
import { format } from 'date-fns';
import { Order } from '../../types/Order';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const Reports = () => {
    const theme = useTheme();
    const [orders, setOrders] = useState<Order[]>([]);
    const [analytics, setAnalytics] = useState({
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalSales: 0,
        totalPaymentsReceived: 0,
        totalPendingPayments: 0,
    });
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [graphData, setGraphData] = useState<any[]>([]);
    const [timeRange, setTimeRange] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(2024);
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month());

    useEffect(() => {
        // Load orders from localStorage
        const loadOrders = () => {
            const storedOrders = localStorage.getItem('orders');
            if (storedOrders) {
                return JSON.parse(storedOrders);
            }
            return [];
        };

        const orders = loadOrders();
        
        // Calculate analytics
        const analytics = orders.reduce((acc: any, order: any) => {
            // Count total orders
            acc.totalOrders = (acc.totalOrders || 0) + 1;

            // Count completed orders (Done and Paid, or moved to history)
            if ((order.status === 'Done' && order.billingStatus === 'Paid') || order.movedToHistory) {
                acc.completedOrders = (acc.completedOrders || 0) + 1;
            }

            // Count pending orders (not completed and not cancelled)
            if (!order.movedToHistory && order.status !== 'Cancelled' && 
                !(order.status === 'Done' && order.billingStatus === 'Paid')) {
                acc.pendingOrders = (acc.pendingOrders || 0) + 1;
            }

            // Calculate total sales from completed orders
            if ((order.status === 'Done' && order.billingStatus === 'Paid') || order.movedToHistory) {
                acc.totalSales = (acc.totalSales || 0) + (Number(order.totalAmount) || 0);
            }

            // Calculate total payments received
            if (order.billingStatus === 'Paid') {
                acc.totalPaymentsReceived = (acc.totalPaymentsReceived || 0) + (Number(order.totalAmount) || 0);
            }

            // Calculate pending payments
            if (order.billingStatus !== 'Paid' && order.status !== 'Cancelled') {
                acc.totalPendingPayments = (acc.totalPendingPayments || 0) + 
                    ((Number(order.totalAmount) || 0) - (Number(order.depositAmount) || 0));
            }

            return acc;
        }, {
            totalOrders: 0,
            completedOrders: 0,
            pendingOrders: 0,
            totalSales: 0,
            totalPaymentsReceived: 0,
            totalPendingPayments: 0,
        });

        setAnalytics(analytics);
        setOrders(orders);

        // Add event listeners for updates
        const handleOrderUpdate = () => {
            const updatedOrders = loadOrders();
            setOrders(updatedOrders);
            const updatedAnalytics = calculateAnalytics(updatedOrders);
            setAnalytics(updatedAnalytics);
        };

        window.addEventListener('ordersUpdated', handleOrderUpdate);
        window.addEventListener('storage', handleOrderUpdate);

        return () => {
            window.removeEventListener('ordersUpdated', handleOrderUpdate);
            window.removeEventListener('storage', handleOrderUpdate);
        };
    }, []);

    const calculateAnalytics = (orders: any[]) => {
        return orders.reduce((acc: any, order: any) => {
            // Count total orders
            acc.totalOrders = (acc.totalOrders || 0) + 1;

            // Count completed orders (Done and Paid, or moved to history)
            if ((order.status === 'Done' && order.billingStatus === 'Paid') || order.movedToHistory) {
                acc.completedOrders = (acc.completedOrders || 0) + 1;
            }

            // Count pending orders (not completed and not cancelled)
            if (!order.movedToHistory && order.status !== 'Cancelled' && 
                !(order.status === 'Done' && order.billingStatus === 'Paid')) {
                acc.pendingOrders = (acc.pendingOrders || 0) + 1;
            }

            // Calculate total sales from completed orders
            if ((order.status === 'Done' && order.billingStatus === 'Paid') || order.movedToHistory) {
                acc.totalSales = (acc.totalSales || 0) + (Number(order.totalAmount) || 0);
            }

            // Calculate total payments received
            if (order.billingStatus === 'Paid') {
                acc.totalPaymentsReceived = (acc.totalPaymentsReceived || 0) + (Number(order.totalAmount) || 0);
            }

            // Calculate pending payments
            if (order.billingStatus !== 'Paid' && order.status !== 'Cancelled') {
                acc.totalPendingPayments = (acc.totalPendingPayments || 0) + 
                    ((Number(order.totalAmount) || 0) - (Number(order.depositAmount) || 0));
            }

            return acc;
        }, {
            totalOrders: 0,
            completedOrders: 0,
            pendingOrders: 0,
            totalSales: 0,
            totalPaymentsReceived: 0,
            totalPendingPayments: 0,
        });
    };

    useEffect(() => {
        if (selectedMetric) {
            const data = generateGraphData(selectedMetric, timeRange, selectedYear, selectedMonth);
            setGraphData(data);
        }
    }, [selectedMetric, timeRange, selectedYear, selectedMonth]);

    const generateGraphData = (metric: string, range: string, year: number, month?: number) => {
        const data: any[] = [];
        let startDate: dayjs.Dayjs;
        let endDate: dayjs.Dayjs;
        let interval: 'day' | 'month' = 'day';
        let count = 0;

        switch (range) {
            case 'monthly':
                interval = 'day';
                startDate = dayjs().year(year).month(month || 0).startOf('month');
                const daysInMonth = startDate.daysInMonth();
                count = daysInMonth;
                endDate = startDate.add(daysInMonth - 1, 'day');
                break;
            case 'annually':
                interval = 'month';
                startDate = dayjs().year(year).startOf('year');
                count = 12;
                endDate = startDate.endOf('year');
                break;
            default:
                interval = 'day';
                startDate = dayjs().year(year).month(month || 0).startOf('month');
                count = startDate.daysInMonth();
                endDate = startDate.endOf('month');
        }

        // Filter orders based on the date range
        const filteredOrders = orders.filter((order: any) => {
            const orderDate = dayjs(order.orderDate);
            return orderDate.isBetween(startDate, endDate, null, '[]');
        });

        // Generate data points
        for (let i = 0; i < count; i++) {
            const currentDate = startDate.add(i, interval);
            const nextDate = currentDate.add(1, interval);

            // Filter orders for this data point
            const periodOrders = filteredOrders.filter((order: any) => {
                const orderDate = dayjs(order.orderDate);
                return orderDate.isBetween(currentDate, nextDate, null, '[)');
            });

            // Calculate value based on metric
            let value = 0;
            switch (metric) {
                case 'Total Orders':
                    value = periodOrders.length;
                    break;
                case 'Completed Orders':
                    value = periodOrders.filter((order: any) => 
                        (order.status === 'Done' && order.billingStatus === 'Paid') || order.movedToHistory
                    ).length;
                    break;
                case 'Pending Orders':
                    value = periodOrders.filter((order: any) => 
                        !order.movedToHistory && order.status !== 'Cancelled' && 
                        !(order.status === 'Done' && order.billingStatus === 'Paid')
                    ).length;
                    break;
                case 'Total Sales':
                    value = periodOrders.reduce((sum: number, order: any) => 
                        ((order.status === 'Done' && order.billingStatus === 'Paid') || order.movedToHistory) 
                            ? sum + (Number(order.totalAmount) || 0) 
                            : sum
                    , 0);
                    break;
                case 'Total Payments Received':
                    value = periodOrders.reduce((sum: number, order: any) => 
                        order.billingStatus === 'Paid' 
                            ? sum + (Number(order.totalAmount) || 0) 
                            : sum
                    , 0);
                    break;
                case 'Total Pending Payments':
                    value = periodOrders.reduce((sum: number, order: any) => 
                        (order.billingStatus !== 'Paid' && order.status !== 'Cancelled')
                            ? sum + ((Number(order.totalAmount) || 0) - (Number(order.depositAmount) || 0))
                            : sum
                    , 0);
                    break;
            }

            data.push({
                date: range === 'annually' 
                    ? currentDate.format('MMM')
                    : currentDate.format('MMM DD'),
                value: value,
                amount: value
            });
        }

        return data;
    };

    const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedMetric(title)}
            style={{ cursor: 'pointer' }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    height: '100%',
                    background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.background.paper, 0.95)}, 
                        ${alpha(theme.palette.background.paper, 0.7)})`,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: alpha(color, 0.1),
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'scale(1.02)',
                    },
                    ...(selectedMetric === title && {
                        borderColor: color,
                        borderWidth: 2,
                    }),
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(color, 0.1),
                            color: color,
                            display: 'flex',
                        }}
                    >
                        {icon}
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: color }}>
                            {typeof value === 'number' && value.toLocaleString('en-US', {
                                style: value > 100 ? 'currency' : 'decimal',
                                currency: 'PHP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                            {typeof value === 'string' && value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );

    const renderGraph = () => {
        const color = theme.palette.primary.main;
        
        switch (selectedMetric) {
            case 'Total Sales':
            case 'Total Payments Received':
            case 'Total Pending Payments':
                return (
                    <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value: number) => 
                                new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'PHP'
                                }).format(value)
                            }
                        />
                        <Legend />
                        <Area type="monotone" dataKey="amount" stroke={color} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                );
            default:
                return (
                    <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke={color} activeDot={{ r: 8 }} />
                    </LineChart>
                );
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">
                    Reports & Analytics
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Orders"
                        value={analytics.totalOrders}
                        icon={<ShoppingCartIcon />}
                        color={theme.palette.primary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Completed Orders"
                        value={analytics.completedOrders}
                        icon={<CheckCircleIcon />}
                        color={theme.palette.success.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Pending Orders"
                        value={analytics.pendingOrders}
                        icon={<ScheduleIcon />}
                        color={theme.palette.warning.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Sales"
                        value={analytics.totalSales}
                        icon={<TrendingUpIcon />}
                        color={theme.palette.info.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Payments Received"
                        value={analytics.totalPaymentsReceived}
                        icon={<AssessmentIcon />}
                        color={theme.palette.success.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Pending Payments"
                        value={analytics.totalPendingPayments}
                        icon={<LocalAtmIcon />}
                        color={theme.palette.warning.main}
                    />
                </Grid>
            </Grid>

            {selectedMetric && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper sx={{ mt: 4, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">{selectedMetric} Analytics</Typography>
                            <Stack direction="row" spacing={2}>
                                <FormControl size="small">
                                    <Select
                                        value={timeRange}
                                        onChange={(e) => setTimeRange(e.target.value)}
                                    >
                                        <MenuItem value="monthly">Monthly View</MenuItem>
                                        <MenuItem value="annually">Annual View</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl size="small">
                                    <Select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    >
                                        {Array.from({ length: 10 }, (_, i) => 2024 + i).map(year => (
                                            <MenuItem key={year} value={year}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {timeRange === 'monthly' && (
                                    <FormControl size="small">
                                        <Select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i).map(month => (
                                                <MenuItem key={month} value={month}>
                                                    {dayjs().month(month).format('MMMM')}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </Stack>
                        </Box>
                        <Box sx={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                {renderGraph()}
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </motion.div>
            )}
        </Box>
    );
};

export default Reports;
