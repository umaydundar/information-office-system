// /client/src/components/common/NavbarStyles.js

import { styled } from '@mui/system';
import { Box, ListItem } from '@mui/material';

export const Sidebar = styled(Box)({
  backgroundColor: '#001f3f',
  height: 'auto', // Allow dynamic height
  width: '240px',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '20px',
});

export const NavItem = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  color: '#ffffff',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#00509e',
    color: '#ffffff',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease-in-out',
  },
  '& a': {
    textDecoration: 'none',
    color: 'inherit',
    width: '100%',
    padding: '10px 20px',
    display: 'block',
  },
  transition: 'transform 0.3s ease-in-out',
}));


export const NavSubItem = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  color: '#ffffff',
  fontWeight: 'normal',
  paddingLeft: theme.spacing(4),
  '&:hover': {
    backgroundColor: '#00509e',
    color: '#ffffff',
    transition: 'all 0.3s ease-in-out',
  },
  '& a': {
    textDecoration: 'none',
    color: 'inherit',
    width: '100%',
    padding: '8px 16px',
    display: 'block',
  },
}));