import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GuideNavbar from './GuideNavbar';
import TodaysToursAndFairsPage from '../../pages/common/advisor-coordinator-guide/TodaysToursAndFairsPage';
import TourCalendarPage from '../../pages/common/advisor-coordinator-guide/TourCalendarPage';
import FairCalendarPage from '../../pages/common/advisor-coordinator-guide/FairCalendarPage';
import PointsFeedbackPage from '../../pages/common/advisor-coordinator-guide/PointsFeedbackPage';
import ParticipateToursPage from '../../pages/common/advisor-coordinator-guide/ParticipateToursPage';
import ProfilePage from '../../pages/common/all/ProfilePage';
import FinishTour from '../../pages/common/advisor-coordinator-guide/FinishTour';
import ScoreCardPage from '../../pages/common/advisor-coordinator-guide/ScoreCardPage'

function GuideDashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <GuideNavbar />
      <div style={{ marginLeft: '240px', padding: '20px', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Navigate to="todays-tours-and-fairs" />} />
          <Route path="todays-tours-and-fairs" element={<TodaysToursAndFairsPage />} />
          <Route path="tour-calendar" element={<TourCalendarPage />} />
          <Route path="fair-calendar" element={<FairCalendarPage />} />
          <Route path="participate-tours" element={<ParticipateToursPage />} />
          <Route path="points-feedback" element={<PointsFeedbackPage />} />
          <Route path="finish-tour" element={<FinishTour/>}/>
          <Route path="scorecard" element={<ScoreCardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="logout" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default GuideDashboard;
