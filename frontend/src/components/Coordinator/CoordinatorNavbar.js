import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, Typography, Collapse } from '@mui/material';
import { Sidebar, NavItem, NavSubItem } from '../common/NavbarStyles';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function CoordinatorNavbar() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || 'guide/todays-tours-and-fairs';

  const [openGuideMenu, setOpenGuideMenu] = useState(false);

  const handleGuideMenuClick = () => {
    setOpenGuideMenu(!openGuideMenu);
  };

  return (
    <Drawer variant="permanent" anchor="left">
    <Sidebar>
      <Typography
        variant="h6"
        style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}
      >
        Coordinator Dashboard
      </Typography>
      <List component="nav">
        <NavItem onClick={handleGuideMenuClick}  style={{
          color: 'white',
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          paddingInlineStart: '35px',
          fontWeight: 'bold',
          }}>
          Guide Menu
          {openGuideMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </NavItem>
        <Collapse in={openGuideMenu} timeout="auto" unmountOnExit>
          <List component="div" style={{ paddingLeft: '20px' }}> 
            <NavSubItem selected={currentPath === 'guide/todays-tours-and-fairs'}>
              <Link to="/coordinator/guide/todays-tours-and-fairs">Today's Tours</Link>
            </NavSubItem>
            <NavSubItem selected={currentPath === 'guide/tour-calendar'}>
              <Link to="/coordinator/guide/tour-calendar">Tour Calendar</Link>
            </NavSubItem>
            <NavSubItem selected={currentPath === 'guide/fair-calendar'}>
              <Link to="/coordinator/guide/fair-calendar">Fair Calendar</Link>
            </NavSubItem>
            <NavSubItem selected={currentPath === 'guide/participate-tours'}>
              <Link to="/coordinator/guide/participate-tours">Participate Tours</Link>
            </NavSubItem>
            <NavSubItem selected={currentPath === 'guide/points-feedback'}>
              <Link to="/coordinator/guide/points-feedback">Points & Feedback</Link>
            </NavSubItem>
            <NavSubItem selected={currentPath === 'guide/finish-tour'}>
            <Link to="guide/finish-tour">Finish Tour</Link>
          </NavSubItem>
            <NavSubItem selected={currentPath === 'guide/scorecard'}>
              <Link to="/coordinator/guide/scorecard">Scorecard</Link>
            </NavSubItem>
          </List>
        </Collapse>
        <NavItem selected={currentPath === 'users'}>
          <Link to="/coordinator/users">Users</Link>
        </NavItem>
        <NavItem selected={currentPath === 'guide-schedules'}>
          <Link to="/coordinator/guide-schedules">Guide Schedules</Link>
        </NavItem>
        <NavItem selected={currentPath === 'guide-points-feedback'}>
            <Link to="/coordinator/guide-points-feedback">Guide Points & Feedback</Link>
          </NavItem>
        <NavItem selected={currentPath === 'all-fairs-calendar'}>
          <Link to="/coordinator/all-fairs-calendar">All Fairs Calendar</Link>
        </NavItem>
        <NavItem selected={currentPath === 'fair-requests'}>
          <Link to="/coordinator/fair-requests">Fair Requests</Link>
        </NavItem>
        <NavItem selected={currentPath === 'assign-guides-for-fairs'}>
          <Link to="/coordinator/assign-guides-for-fairs">Assign Guides For Fairs</Link>
        </NavItem>
        <NavItem selected={currentPath === 'profile'}>
          <Link to="/coordinator/profile">Profile</Link>
        </NavItem>
        <NavItem selected={currentPath === 'logout'}>
          <Link to="/login">Log Out</Link>
        </NavItem>
      </List>
    </Sidebar>
  </Drawer>
  );
}

export default CoordinatorNavbar;



