import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, Typography, Collapse } from '@mui/material';
import { Sidebar, NavItem, NavSubItem } from '../common/NavbarStyles';

function AdminNavbar() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || 'users';


  return (
    <Drawer variant="permanent" anchor="left">
      <Sidebar>
        <Typography
          variant="h6"
          sx={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}
        >
          Admin Dashboard
        </Typography>
        <List>
          <NavItem selected={currentPath === 'users'}>
            <Link to="/admin/users">Users</Link>
          </NavItem>
          <NavItem selected={currentPath === 'classrooms'}>
            <Link to="/admin/classrooms">Classrooms</Link>
          </NavItem>
          <NavItem selected={currentPath === 'announcements'}>
            <Link to="/admin/announcements">Announcements</Link>
          </NavItem>
          <NavItem selected={currentPath === 'all-tours'}>
            <Link to="/admin/all-tours">All Tours Calendar</Link>
          </NavItem>
          <NavItem selected={currentPath === 'all-fairs'}>
            <Link to="/admin/all-fairs">All Fairs Calendar</Link>
          </NavItem>
          <NavItem selected={currentPath === 'request-history'}>
            <Link to="/admin/request-history">Request History</Link>
          </NavItem>
          <NavItem selected={currentPath === 'guide-schedules'}>
            <Link to="/admin/guide-schedules">Guide Schedules</Link>
          </NavItem>
          <NavItem selected={currentPath === 'guide-points-and-feedback'}>
            <Link to="/admin/guide-points-and-feedback">Guide Points & Feedback</Link>
          </NavItem>
          <NavItem selected={currentPath === 'data-analysis'}>
            <Link to="/admin/data-analysis">Data Analysis</Link>
          </NavItem>
          <NavItem selected={currentPath === 'profile'}>
            <Link to="/admin/profile">Profile</Link>
          </NavItem>
          <NavItem selected={currentPath === 'logout'}>
            <Link to="/login">Log Out</Link>
          </NavItem>
        </List>
      </Sidebar>
    </Drawer>
  );
}
export default AdminNavbar;
