import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import UsersPage from '../../pages/common/admin-coordinator/UsersPage';
import DataAnalysisPage from '../../pages/Admin/DataAnalysisPage';
import GuidesSchedulesPage from '../../pages/common/admin-advisor-coordinator/GuideSchedulesPage';
import AllToursPage from '../../pages/common/admin-advisor/AllToursCalendarPage';
import AllFairsPage from '../../pages/common/admin-coordinator/AllFairsCalendarPage';
import RequestHistoryPage from '../../pages/common/admin-advisor/RequestHistoryPage';
import GuidePointsFeedbackPage from '../../pages/common/admin-advisor-coordinator/GuidePointsFeedbackPage';
import ClassroomsPage from '../../pages/Admin/ClassroomsPage';
import ProfilePage from '../../pages/common/all/ProfilePage';
import PublishAnnouncementsPage from '../../pages/Admin/PublishAnnouncementsPage';

function AdminDashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <AdminNavbar/>
      <div style={{ marginLeft: '240px', padding: '20px', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Navigate to="users" />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="classrooms" element={<ClassroomsPage />} />
          <Route path="announcements" element={<PublishAnnouncementsPage />} />
          <Route path="all-tours" element={<AllToursPage />}/>
          <Route path="all-fairs"element={<AllFairsPage />}/>
          <Route path="request-history"element={<RequestHistoryPage />}/>
          <Route path="guide-schedules"element={<GuidesSchedulesPage/>}/>
          <Route path="guide-points-and-feedback"element={<GuidePointsFeedbackPage />}/>
          <Route path="data-analysis" element={<DataAnalysisPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="logout" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
