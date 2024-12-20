import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, Typography } from '@mui/material';
import { Sidebar, NavItem } from '../common/NavbarStyles';

function GuideNavbar() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || 'todays-tours';

  return (
    <Drawer variant="permanent" anchor="left">
      <Sidebar>
        <Typography
          variant="h6"
          sx={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}
        >
          Guide Dashboard
        </Typography>
        <List>
          <NavItem selected={currentPath === 'todays-tours-and-fairs'}>
            <Link to="/guide/todays-tours-and-fairs">Today's Tours And Fairs</Link>
          </NavItem>
          <NavItem selected={currentPath === 'tour-calendar'}>
            <Link to="/guide/tour-calendar">Tour Calendar</Link>
          </NavItem>
          <NavItem selected={currentPath === 'fair-calendar'}>
            <Link to="/guide/fair-calendar">Fair Calendar</Link>
          </NavItem>
          <NavItem selected={currentPath === 'participate-tours'}>
            <Link to="/guide/participate-tours">Participate Tours</Link>
          </NavItem>
          <NavItem selected={currentPath === 'points-feedback'}>
            <Link to="/guide/points-feedback">Points & Feedback</Link>
          </NavItem>
          <NavItem selected={currentPath === 'finish-tour'}>
            <Link to="/guide/finish-tour">Finish Tour</Link>
          </NavItem>
          <NavItem selected={currentPath === 'scorecard'}>
            <Link to="/guide/scorecard">Scorecard</Link>
          </NavItem>
          <NavItem selected={currentPath === 'profile'}>
            <Link to="/guide/profile">Profile</Link>
          </NavItem>
          <NavItem selected={currentPath === 'logout'}>
            <Link to="/login">Log Out</Link>
          </NavItem>
        </List>
      </Sidebar>
    </Drawer>
  );
}

export default GuideNavbar;
