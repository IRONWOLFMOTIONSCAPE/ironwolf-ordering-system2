import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { keyframes } from '@mui/system';

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

export const GlossyButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(
    90deg,
    ${theme.palette.primary.main}ee,
    ${theme.palette.primary.light}ff,
    ${theme.palette.primary.main}ee
  )`,
  backgroundSize: '200% auto',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  padding: '10px 24px',
  borderRadius: '12px',
  fontWeight: 600,
  letterSpacing: '0.5px',
  textTransform: 'none',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '200%',
    height: '100%',
    background: `linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    )`,
    transition: 'all 0.5s',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    animation: `${shimmer} 2s infinite`,
    backgroundSize: '200% auto',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));
