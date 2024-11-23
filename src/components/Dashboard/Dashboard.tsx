import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Container,
    Avatar,
    useTheme,
    ListItemButton,
    CssBaseline,
    Paper,
    Collapse,
    Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import BackupIcon from '@mui/icons-material/Backup';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { logout } from '../../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './Home';
import CreateOrder from '../CreateOrder/CreateOrder';
import OrderHistory from '../OrderHistory/OrderHistory';
import Users from '../Settings/Users';
import SublimationTypes from '../Settings/SublimationTypes';
import OrderTracking from '../OrderTracking/OrderTracking';
import Reports from '../Reports/Reports';
import BackupManager from '../Settings/BackupManager';
import { alpha } from '@mui/material/styles';
import { isDemoMode, exitDemoMode } from '../../utils/demoManager';

const drawerWidth = 280;

// Animation for demo mode indicator
const pulseKeyframes = `
@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.05);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}`;

// Animation variants for menu items
const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: 0.1 * index,
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    }),
};

type SectionType = "home" | "create" | "history" | "reports" | "tracking" | "settings-users" | "settings-sublimation" | "settings-backup";

const Dashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<SectionType>('home');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const [isDemo, setIsDemo] = useState(isDemoMode());

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleSectionChange = (section: SectionType) => {
        setSelectedSection(section);
    };

    const handleExitDemo = () => {
        if (exitDemoMode()) {
            dispatch(logout());
            navigate('/');
        }
    };

    const menuItems = [
        { 
            text: 'Home', 
            icon: <HomeIcon sx={{ 
                fontSize: '1.3rem',
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))',
                transition: 'all 0.3s ease',
            }} />, 
            section: 'home' 
        },
        { text: 'Create Order', icon: <AddCircleOutlineIcon />, section: 'create' },
        { text: 'Order History', icon: <HistoryIcon />, section: 'history' },
        { text: 'Reports', icon: <AssessmentIcon />, section: 'reports' },
        { text: 'Order Tracking', icon: <TrackChangesIcon />, section: 'tracking' },
    ];

    // Filter settings menu items based on user role
    const settingsMenuItems = [
        ...(user?.role === 'Manager' ? [
            { text: 'Users', icon: <PeopleIcon />, section: 'settings-users' },
            { text: 'Backup Management', icon: <BackupIcon />, section: 'settings-backup' }
        ] : []),
        { text: 'Sublimation Types', icon: <CategoryIcon />, section: 'settings-sublimation' },
    ];

    const drawer = (
        <Box 
            component={motion.div}
            initial={{ x: -drawerWidth }}
            animate={{ x: 0 }}
            transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20,
                mass: 1
            }}
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.default',
                overflow: 'hidden',
                position: 'relative',
                borderRight: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '35%',
                    background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.primary.main, 0.08)} 0%, 
                        ${alpha(theme.palette.primary.light, 0.05)} 50%,
                        ${alpha(theme.palette.background.default, 0)} 100%)`,
                    zIndex: 0,
                }
            }}
        >
            {/* User Profile Section */}
            <Box 
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                sx={{ 
                    p: 3,
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2,
                    borderBottom: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.background.paper, 0.8)}, 
                        ${alpha(theme.palette.background.paper, 0.4)})`,
                    backdropFilter: 'blur(8px)',
                    position: 'relative',
                    zIndex: 1,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '10%',
                        right: '10%',
                        height: '1px',
                        background: `linear-gradient(90deg, 
                            transparent, 
                            ${alpha(theme.palette.primary.main, 0.2)}, 
                            transparent)`,
                    }
                }}
            >
                <Avatar 
                    component={motion.div}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    sx={{ 
                        width: 52,
                        height: 52,
                        bgcolor: theme.palette.primary.main,
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                        border: `2px solid ${alpha(theme.palette.common.white, 0.9)}`,
                        '&:hover': {
                            boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                        }
                    }}
                >
                    {user?.name?.charAt(0)}
                </Avatar>
                <Box>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            fontWeight: 700, 
                            lineHeight: 1.2,
                            fontSize: '1.1rem',
                            mb: 0.5,
                            background: `linear-gradient(135deg, 
                                ${theme.palette.primary.main}, 
                                ${theme.palette.primary.light})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))',
                        }}
                    >
                        {user?.name}
                    </Typography>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            lineHeight: 1,
                            color: alpha(theme.palette.text.secondary, 0.9),
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            pl: 0.5,
                        }}
                    >
                        <AccountCircleIcon sx={{ 
                            fontSize: '0.95rem',
                            color: alpha(theme.palette.primary.main, 0.7),
                        }} />
                        {user?.role}
                    </Typography>
                </Box>
            </Box>

            {/* Menu Items */}
            <List 
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                sx={{ 
                    px: 2, 
                    py: 2.5, 
                    flex: 1,
                    overflow: 'hidden auto',
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: alpha(theme.palette.primary.main, 0.2),
                        borderRadius: '4px',
                        '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.3),
                        }
                    },
                }}
            >
                <AnimatePresence>
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={item.text}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                        >
                            <ListItemButton
                                selected={selectedSection === item.section}
                                onClick={() => handleSectionChange(item.section as SectionType)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    '&.Mui-selected': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </motion.div>
                    ))}

                    {/* Settings Menu - Always visible but with filtered items */}
                    <>
                        <Divider sx={{ my: 2 }} />
                        <ListItemButton
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                            {settingsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </ListItemButton>

                        <Collapse in={settingsOpen}>
                            {settingsMenuItems.map((item, index) => (
                                <motion.div
                                    key={item.text}
                                    variants={menuItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={index}
                                >
                                    <ListItemButton
                                        selected={selectedSection === item.section}
                                        onClick={() => handleSectionChange(item.section as SectionType)}
                                        sx={{
                                            pl: 4,
                                            borderRadius: 2,
                                            mb: 0.5,
                                            '&.Mui-selected': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </motion.div>
                            ))}
                        </Collapse>
                    </>
                </AnimatePresence>
            </List>

            {/* Logout Button */}
            <Box 
                component={motion.div}
                whileHover={{ y: -2 }}
                sx={{ 
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    background: `linear-gradient(to top, 
                        ${alpha(theme.palette.background.paper, 0.9)}, 
                        ${alpha(theme.palette.background.paper, 0.5)})`,
                    backdropFilter: 'blur(8px)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isDemo && (
                        <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            onClick={handleExitDemo}
                            sx={{
                                borderRadius: 4,
                                textTransform: 'none',
                                border: '1px solid',
                                borderColor: 'warning.main',
                                color: 'warning.main',
                                '&:hover': {
                                    backgroundColor: 'warning.main',
                                    color: 'warning.contrastText',
                                }
                            }}
                        >
                            Exit Demo Mode
                        </Button>
                    )}
                    <IconButton
                        size="large"
                        onClick={handleLogout}
                        sx={{
                            color: alpha(theme.palette.error.main, 0.8),
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                            },
                        }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );

    const renderSection = () => {
        switch (selectedSection) {
            case 'home':
                return <Home onNavigate={(section) => setSelectedSection(section as SectionType)} />;
            case 'create':
                return <CreateOrder onSectionChange={handleSectionChange} />;
            case 'history':
                return <OrderHistory />;
            case 'reports':
                return <Reports />;
            case 'tracking':
                return <OrderTracking />;
            case 'settings-users':
                return <Users />;
            case 'settings-sublimation':
                return <SublimationTypes />;
            case 'settings-backup':
                return <BackupManager />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <CssBaseline />
            <style>
                {pulseKeyframes}
            </style>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'transparent',
                    borderBottom: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    backdropFilter: 'blur(12px)',
                    background: `linear-gradient(to right, 
                        ${alpha(theme.palette.background.paper, 0.95)}, 
                        ${alpha(theme.palette.background.paper, 0.9)})`,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, 
                            ${alpha(theme.palette.primary.main, 0.08)} 0%, 
                            ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                        zIndex: -1,
                    }
                }}
            >
                <Toolbar 
                    sx={{ 
                        justifyContent: 'space-between', 
                        height: 72,
                        px: { xs: 2, sm: 3 },
                        gap: 2,
                    }}
                >
                    {/* Left side - Branding */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ 
                                display: { sm: 'none' },
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'primary.main',
                                    transform: 'rotate(180deg)',
                                    transition: 'all 0.3s ease-in-out',
                                }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        
                        <Box 
                            component={motion.div}
                            whileHover={{ scale: 1.02 }}
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                position: 'relative',
                            }}
                        >
                            {/* Main Brand Name */}
                            <Typography 
                                variant="h6" 
                                noWrap 
                                sx={{ 
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, 
                                        ${theme.palette.primary.main}, 
                                        ${theme.palette.primary.light})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '0.5px',
                                    position: 'relative',
                                    '&::after': isDemo ? {
                                        content: '"DEMO MODE"',
                                        position: 'absolute',
                                        top: '-18px',
                                        right: '-60px',
                                        fontSize: '0.7rem',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: theme.palette.warning.main,
                                        color: theme.palette.warning.contrastText,
                                        fontWeight: 600,
                                        letterSpacing: '0.5px',
                                        animation: pulseKeyframes
                                    } : {}
                                }}
                            >
                                IronWolf
                            </Typography>
                            {/* Tagline with Highlight */}
                            <Box 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    position: 'relative',
                                }}
                            >
                                <Typography 
                                    variant="subtitle2"
                                    sx={{ 
                                        fontWeight: 600,
                                        letterSpacing: '3px',
                                        fontSize: '0.7rem',
                                        textTransform: 'uppercase',
                                        color: alpha(theme.palette.text.primary, 0.7),
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        pl: 0.5,
                                        '&::before': {
                                            content: '""',
                                            width: 24,
                                            height: 2,
                                            background: `linear-gradient(to right, 
                                                ${theme.palette.primary.main}, 
                                                ${alpha(theme.palette.primary.light, 0.5)})`,
                                            borderRadius: 1,
                                        }
                                    }}
                                >
                                    Digital Printing Solutions
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Right side - Actions */}
                    <Box 
                        component={motion.div}
                        initial={false}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2 
                        }}
                    >
                        {/* Search */}
                        <Box 
                            component={motion.div}
                            animate={{ 
                                width: searchOpen ? 300 : 44,
                                backgroundColor: searchOpen 
                                    ? alpha(theme.palette.background.paper, 0.9) 
                                    : 'transparent'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            sx={{ 
                                position: 'relative',
                                height: 44,
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: searchOpen ? '1px solid' : 'none',
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                backdropFilter: searchOpen ? 'blur(8px)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.background.paper, 0.05),
                                }
                            }}
                        >
                            <IconButton
                                onClick={() => setSearchOpen(!searchOpen)}
                                sx={{ 
                                    width: 44,
                                    height: 44,
                                    position: 'relative',
                                    zIndex: 2,
                                    color: searchOpen ? 'primary.main' : 'text.secondary',
                                    transition: 'color 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        color: 'primary.main',
                                    }
                                }}
                            >
                                <SearchIcon />
                            </IconButton>
                            <AnimatePresence>
                                {searchOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ 
                                            position: 'absolute',
                                            left: 44,
                                            right: 0,
                                            zIndex: 1,
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                border: 'none',
                                                outline: 'none',
                                                background: 'transparent',
                                                padding: '0 16px',
                                                fontSize: '0.95rem',
                                                color: theme.palette.text.primary,
                                                fontFamily: theme.typography.fontFamily,
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Box>

                        {/* Notifications */}
                        <IconButton
                            component={motion.button}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            size="small"
                            sx={{
                                color: 'text.secondary',
                                width: 44,
                                height: 44,
                                position: 'relative',
                                '&:hover': {
                                    color: 'primary.main',
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                }
                            }}
                        >
                            <NotificationsNoneIcon sx={{ fontSize: '1.5rem' }} />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.error.main,
                                    border: `2px solid ${theme.palette.background.paper}`,
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                        '0%': {
                                            transform: 'scale(0.95)',
                                            boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0.4)}`,
                                        },
                                        '70%': {
                                            transform: 'scale(1)',
                                            boxShadow: `0 0 0 6px ${alpha(theme.palette.error.main, 0)}`,
                                        },
                                        '100%': {
                                            transform: 'scale(0.95)',
                                            boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0)}`,
                                        }
                                    }
                                }}
                            />
                        </IconButton>

                        {/* User Menu */}
                        <IconButton
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            size="small"
                            sx={{
                                width: 44,
                                height: 44,
                                background: `linear-gradient(135deg, 
                                    ${theme.palette.primary.main}, 
                                    ${theme.palette.primary.light})`,
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                                '&:hover': {
                                    background: `linear-gradient(135deg, 
                                        ${theme.palette.primary.dark}, 
                                        ${theme.palette.primary.main})`,
                                }
                            }}
                        >
                            {user?.name?.charAt(0)}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: drawerWidth,
                            borderRight: 'none',
                            boxShadow: theme.shadows[2]
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: drawerWidth,
                            borderRight: 'none',
                            boxShadow: theme.shadows[2]
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    mt: '72px'
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        style={{ height: '100%' }}
                    >
                        {renderSection()}
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default Dashboard;
