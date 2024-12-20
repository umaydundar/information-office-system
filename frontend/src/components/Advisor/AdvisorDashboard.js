import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdvisorNavbar from './AdvisorNavbar';
import AssignGuidesPage from '../../pages/Advisor/AssignGuidesForToursPage';
import PointsFeedbackPage from '../../pages/common/advisor-coordinator-guide/PointsFeedbackPage';
import ProfilePage from '../../pages/common/all/ProfilePage';
import GuideSchedulesPage from '../../pages/common/admin-advisor-coordinator/GuideSchedulesPage';
import GuidePointsFeedbackPage from '../../pages/common/admin-advisor-coordinator/GuidePointsFeedbackPage';
import AllToursCalendarPage from '../../pages/common/admin-advisor/AllToursCalendarPage';
import TodaysToursAndFairsPage from '../../pages/common/advisor-coordinator-guide/TodaysToursAndFairsPage';
import TourCalendarPage from '../../pages/common/advisor-coordinator-guide/TourCalendarPage';
import FairCalendarPage from '../../pages/common/advisor-coordinator-guide/FairCalendarPage';
import ParticipateToursPage from '../../pages/common/advisor-coordinator-guide/ParticipateToursPage';
import ScoreCardPage from '../../pages/common/advisor-coordinator-guide/ScoreCardPage'
import TourRequestsPage from '../../pages/Advisor/TourRequestsPage';
import AssignTourClassroomPage from '../../pages/Advisor/AssignTourClassroomPage';
import FinishTour from '../../pages/common/advisor-coordinator-guide/FinishTour';
import RequestHistoryPage from '../../pages/common/admin-advisor/RequestHistoryPage';


function AdvisorDashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <AdvisorNavbar />
      <div style={{ marginLeft: '240px', padding: '20px', width: 'calc(100% - 240px)' }}>
        <Routes>
          <Route path="/" element={<Navigate to="guide/todays-tours-and-fairs" />} />
          <Route path="guide/todays-tours-and-fairs" element={<TodaysToursAndFairsPage />} />
          <Route path="guide/tour-calendar" element={<TourCalendarPage />} />
          <Route path="guide/fair-calendar" element={<FairCalendarPage />} />
          <Route path="guide/participate-tours" element={<ParticipateToursPage />} />
          <Route path="guide/finish-tour" element={<FinishTour/>}/>
          <Route path="guide/points-feedback" element={<PointsFeedbackPage />} />
          <Route path="guide/scorecard" element={<ScoreCardPage />} />

          <Route path="all-tours-calendar" element={<AllToursCalendarPage />} />
          <Route path="guides-schedules" element={<GuideSchedulesPage />} />
          <Route path="guide-points-feedback" element={<GuidePointsFeedbackPage />} />
          <Route path="assign-guides-for-tours" element={<AssignGuidesPage />} />
          <Route path="tour-requests" element={<TourRequestsPage />} />
          <Route path="request-history"element={<RequestHistoryPage />}/>
          <Route path="assign-tour-classroom" element={<AssignTourClassroomPage />} />

          <Route path="profile" element={<ProfilePage />} />
          <Route path="logout" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdvisorDashboard;
