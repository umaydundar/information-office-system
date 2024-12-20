import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, Typography, Collapse } from '@mui/material';
import { Sidebar, NavItem, NavSubItem } from '../common/NavbarStyles';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function AdvisorNavbar() {
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
          Advisor Dashboard
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
                <Link to="/advisor/guide/todays-tours-and-fairs">Today's Tours</Link>
              </NavSubItem>
              <NavSubItem selected={currentPath === 'guide/tour-calendar'}>
                <Link to="/advisor/guide/tour-calendar">Tour Calendar</Link>
              </NavSubItem>
              <NavSubItem selected={currentPath === 'guide/fair-calendar'}>
                <Link to="/advisor/guide/fair-calendar">Fair Calendar</Link>
              </NavSubItem>
              <NavSubItem selected={currentPath === 'guide/participate-tours'}>
                <Link to="/advisor/guide/participate-tours">Participate Tours</Link>
              </NavSubItem>
              <NavSubItem selected={currentPath === 'guide/points-feedback'}>
                <Link to="/advisor/guide/points-feedback">Points & Feedback</Link>
              </NavSubItem>
              <NavSubItem selected={currentPath === 'guide/finish-tour'}>
            <Link to="guide/finish-tour">Finish Tour</Link>
          </NavSubItem>
              <NavSubItem selected={currentPath === 'guide/scorecard'}>
                <Link to="/advisor/guide/scorecard">Scorecard</Link>
              </NavSubItem>
            </List>
          </Collapse>
          <NavItem selected={currentPath === 'all-tours-calendar'}>
            <Link to="/advisor/all-tours-calendar">All Tours Calendar</Link>
          </NavItem>
          <NavItem selected={currentPath === 'guides-schedules'}>
            <Link to="/advisor/guides-schedules">Guides Schedules</Link>
          </NavItem>
          <NavItem selected={currentPath === 'guide-points-feedback'}>
            <Link to="/advisor/guide-points-feedback">Guide Points & Feedback</Link>
          </NavItem>
          <NavItem selected={currentPath === 'assign-guides-for-tours'}>
            <Link to="/advisor/assign-guides-for-tours">Assign Guides For Tours</Link>
          </NavItem>
          <NavItem selected={currentPath === 'tour-requests'}>
            <Link to="/advisor/tour-requests">Tour Requests</Link>
          </NavItem>
          <NavItem selected={currentPath === 'request-history'}>
            <Link to="/advisor/request-history">Request History</Link>
          </NavItem>
          <NavItem selected={currentPath === 'assign-tour-classroom'}>
            <Link to="/advisor/assign-tour-classroom">Assign Tour Classroom</Link>
          </NavItem>
          <NavItem selected={currentPath === 'profile'}>
            <Link to="/advisor/profile">Profile</Link>
          </NavItem>
          <NavItem selected={currentPath === 'logout'}>
            <Link to="/login">Log Out</Link>
          </NavItem>
        </List>
      </Sidebar>
    </Drawer>
  );
}

export default AdvisorNavbar;
