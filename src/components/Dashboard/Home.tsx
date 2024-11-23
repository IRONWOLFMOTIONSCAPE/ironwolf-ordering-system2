import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
    useTheme,
    alpha,
} from '@mui/material';
import {
    AddCircleOutline as AddIcon,
    History as HistoryIcon,
    Assessment as AssessmentIcon,
    Work as WorkIcon,
    TrackChanges as TrackingIcon,
    ArrowForward as ArrowForwardIcon,
    Speed as SpeedIcon,
    Insights as InsightsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickAccessCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    index: number;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, description, icon, onClick, index }) => {
    const theme = useTheme();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100 
            }}
            whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.background.paper, 0.95)}, 
                        ${alpha(theme.palette.background.paper, 0.7)})`,
                    backdropFilter: 'blur(20px)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.12),
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, 
                            ${alpha(theme.palette.primary.main, 0.05)}, 
                            ${alpha(theme.palette.secondary.main, 0.05)})`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                    },
                    '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                        '&::before': {
                            opacity: 1,
                        },
                        '& .icon-button': {
                            background: `linear-gradient(135deg, 
                                ${theme.palette.primary.main}, 
                                ${theme.palette.secondary.main})`,
                            color: 'white',
                            transform: 'scale(1.1) rotate(10deg)',
                        },
                        '& .card-title': {
                            color: theme.palette.primary.main,
                        },
                    },
                }}
                onClick={onClick}
            >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
                        <Box 
                            className="icon-button"
                            sx={{ 
                                p: 1,
                                borderRadius: 1.5,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography 
                                variant="subtitle1" 
                                className="card-title"
                                sx={{ 
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    mb: 0.5,
                                }}
                            >
                                {title}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                    opacity: 0.8,
                                    lineHeight: 1.4,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {description}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: string;
    index: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, index }) => {
    const theme = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    height: '100%',
                    background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.background.paper, 0.95)}, 
                        ${alpha(theme.palette.background.paper, 0.8)})`,
                    backdropFilter: 'blur(20px)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.12),
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, 
                            ${alpha(theme.palette.primary.main, 0.05)}, 
                            ${alpha(theme.palette.secondary.main, 0.05)})`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                    },
                    '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                        '&::before': {
                            opacity: 1,
                        },
                        '& .stat-icon': {
                            transform: 'scale(1.1) rotate(10deg)',
                            color: theme.palette.primary.main,
                        },
                        '& .stat-value': {
                            color: theme.palette.primary.main,
                        }
                    }
                }}
            >
                <Box 
                    className="stat-icon"
                    sx={{ 
                        p: 1,
                        borderRadius: 1.5,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: alpha(theme.palette.primary.main, 0.7),
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography 
                        variant="h5" 
                        className="stat-value"
                        sx={{ 
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            lineHeight: 1.2,
                        }}
                    >
                        {value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                        {trend && (
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: trend.startsWith('+') ? 'success.main' : 'error.main',
                                    display: 'flex', 
                                    alignItems: 'center',
                                    fontWeight: 500,
                                }}
                            >
                                {trend}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
};

const Home: React.FC<{ onNavigate: (section: string) => void }> = ({ onNavigate }) => {
    const theme = useTheme();

    const quickAccessItems = [
        {
            title: 'Create Order',
            description: 'Start a new digital printing order with our streamlined process.',
            icon: <AddIcon />,
            section: 'create',
        },
        {
            title: 'Order History',
            description: 'Access and manage your complete order history.',
            icon: <HistoryIcon />,
            section: 'history',
        },
        {
            title: 'Reports',
            description: 'View detailed analytics and generate custom reports.',
            icon: <AssessmentIcon />,
            section: 'reports',
        },
        {
            title: 'Job Order',
            description: 'Track and manage ongoing production jobs.',
            icon: <WorkIcon />,
            section: 'joborder',
        },
        {
            title: 'Order Tracking',
            description: 'Real-time tracking and status updates for all orders.',
            icon: <TrackingIcon />,
            section: 'tracking',
        },
    ];

    const stats = [
        { title: 'Active Orders', value: '24', icon: <SpeedIcon />, trend: '+12%' },
        { title: 'Completed Today', value: '18', icon: <AssessmentIcon />, trend: '+5%' },
        { title: 'Performance', value: '96%', icon: <InsightsIcon />, trend: '+3%' },
    ];

    return (
        <Box 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            sx={{ 
                height: 'calc(100vh - 100px)',
                display: 'grid',
                gridTemplateRows: 'auto auto 1fr',
                gap: 2,
                p: 2,
                overflow: 'hidden',
                '& > *': {
                    minHeight: 0, // Important for nested scrolling
                },
            }}
        >
            {/* Enhanced Welcome Section - Compact Version */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: { xs: 2, md: 3 },
                    background: `linear-gradient(135deg, 
                        ${theme.palette.primary.main}, 
                        ${theme.palette.primary.dark})`,
                    color: 'white',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at 100% 0%, 
                            ${alpha('#fff', 0.15)} 0%, 
                            ${alpha('#fff', 0)} 50%)`,
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        right: '5%',
                        width: '300px',
                        height: '300px',
                        background: `radial-gradient(circle, 
                            ${alpha(theme.palette.primary.light, 0.4)} 0%, 
                            transparent 70%)`,
                        transform: 'translate(50%, -50%)',
                        filter: 'blur(40px)',
                        opacity: 0.5,
                        animation: 'pulse 8s ease-in-out infinite',
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: { xs: 'wrap', md: 'nowrap' },
                        gap: 2,
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 0 } }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                duration: 0.7,
                                type: "spring",
                                stiffness: 100
                            }}
                        >
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 800,
                                    letterSpacing: '0.02em',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    mb: 1,
                                    background: `linear-gradient(135deg, 
                                        ${alpha('#fff', 0.95)}, 
                                        ${alpha('#fff', 0.85)})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Welcome to IronWolf
                            </Typography>
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    maxWidth: 500,
                                    opacity: 0.9,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    display: { xs: 'none', md: 'block' },
                                }}
                            >
                                Your digital printing management hub. Streamline your workflow and boost productivity.
                            </Typography>
                        </motion.div>
                    </Box>

                    <Box 
                        sx={{ 
                            display: 'flex', 
                            gap: 2,
                            flexWrap: 'wrap',
                            justifyContent: { xs: 'flex-start', md: 'flex-end' },
                        }}
                    >
                        <Paper
                            sx={{
                                px: 2,
                                py: 1,
                                background: alpha('#fff', 0.1),
                                backdropFilter: 'blur(10px)',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    background: alpha('#fff', 0.15),
                                    transform: 'translateY(-2px)',
                                }
                            }}
                            onClick={() => onNavigate('create')}
                        >
                            <AddIcon />
                            <Typography>New Order</Typography>
                        </Paper>
                        
                        <Paper
                            sx={{
                                px: 2,
                                py: 1,
                                background: alpha('#fff', 0.1),
                                backdropFilter: 'blur(10px)',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    background: alpha('#fff', 0.15),
                                    transform: 'translateY(-2px)',
                                }
                            }}
                            onClick={() => onNavigate('tracking')}
                        >
                            <TrackingIcon />
                            <Typography>Track</Typography>
                        </Paper>
                    </Box>
                </Box>
            </Paper>

            {/* Stats Section - Compact */}
            <Grid container spacing={2}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} md={4} key={stat.title}>
                        <StatCard {...stat} index={index} />
                    </Grid>
                ))}
            </Grid>

            {/* Quick Access Section - Grid Layout */}
            <Box sx={{ 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0, // Important for nested scrolling
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2,
                        fontWeight: 600,
                        opacity: 0.9,
                    }}
                >
                    Quick Access
                </Typography>
                <Box sx={{ 
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    },
                    gap: 2,
                    minHeight: 0, // Important for nested scrolling
                }}>
                    {quickAccessItems.map((item, index) => (
                        <QuickAccessCard
                            key={item.title}
                            {...item}
                            onClick={() => onNavigate(item.section)}
                            index={index}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
