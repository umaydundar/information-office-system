import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CoordinatorNavbar from './CoordinatorNavbar';
import TodaysToursAndFairsPage from '../../pages/common/advisor-coordinator-guide/TodaysToursAndFairsPage';
import TourCalendarPage from '../../pages/common/advisor-coordinator-guide/TourCalendarPage';
import FairCalendarPage from '../../pages/common/advisor-coordinator-guide/FairCalendarPage';
import PointsFeedbackPage from '../../pages/common/advisor-coordinator-guide/PointsFeedbackPage';

import UsersPage from '../../pages/common/admin-coordinator/UsersPage';
import GuidesSchedulesPage from '../../pages/common/admin-advisor-coordinator/GuideSchedulesPage';
import GuidePointsFeedbackPage from '../../pages/common/admin-advisor-coordinator/GuidePointsFeedbackPage';
import AllFairsCalendarPage from '../../pages/common/admin-coordinator/AllFairsCalendarPage';
import AssignGuidesForFairsPage from '../../pages/Coordinator/AssignGuidesForFairsPage';
import ProfilePage from '../../pages/common/all/ProfilePage';
import FinishTour from '../../pages/common/advisor-coordinator-guide/FinishTour';
import ParticipateToursPage from '../../pages/common/advisor-coordinator-guide/ParticipateToursPage';
import ScoreCardPage from '../../pages/common/advisor-coordinator-guide/ScoreCardPage'
import FairRequestsPage from '../../pages/Coordinator/FairRequestsPage';

function CoordinatorDashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <CoordinatorNavbar />
      <div style={{ marginLeft: '240px', padding: '20px', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Navigate to="guide/todays-tours-and-fairs" />} />
          <Route path="guide/todays-tours-and-fairs" element={<TodaysToursAndFairsPage />} />
          <Route path="guide/tour-calendar" element={<TourCalendarPage />} />
          <Route path="guide/fair-calendar" element={<FairCalendarPage />} />
          <Route path="guide/finish-tour" element={<FinishTour/>}/>
          <Route path="guide/participate-tours" element={<ParticipateToursPage />} />
          <Route path="guide/points-feedback" element={<PointsFeedbackPage />} />
          <Route path="guide/scorecard" element={<ScoreCardPage />} />

          <Route path="users" element={<UsersPage />} />
          <Route path="guide-schedules" element={<GuidesSchedulesPage />} />
          <Route path="guide-points-feedback" element={<GuidePointsFeedbackPage />} />
          <Route path="all-fairs-calendar" element={<AllFairsCalendarPage />} />
          <Route path="fair-requests" element={<FairRequestsPage />} />
          <Route path="assign-guides-for-fairs" element={<AssignGuidesForFairsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="logout" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default CoordinatorDashboard;
