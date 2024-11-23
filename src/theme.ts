import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    '@media (min-width: 600px)': {
                        paddingLeft: '12px',
                        paddingRight: '12px',
                    },
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: '48px !important',
                    '@media (min-width: 600px)': {
                        minHeight: '48px !important',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '6px 16px',
                    fontSize: '0.875rem',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '8px 16px',
                },
            },
        },
    },
    typography: {
        htmlFontSize: 14,
        h1: {
            fontSize: '2rem',
        },
        h2: {
            fontSize: '1.75rem',
        },
        h3: {
            fontSize: '1.5rem',
        },
        h4: {
            fontSize: '1.25rem',
        },
        h5: {
            fontSize: '1.1rem',
        },
        h6: {
            fontSize: '1rem',
        },
        subtitle1: {
            fontSize: '0.875rem',
        },
        subtitle2: {
            fontSize: '0.8125rem',
        },
        body1: {
            fontSize: '0.875rem',
        },
        body2: {
            fontSize: '0.8125rem',
        },
    },
    spacing: (factor: number) => `${0.75 * factor}rem`,
});

export default theme;
