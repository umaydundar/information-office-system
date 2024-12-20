import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import axios from 'axios';
import moment from 'moment';


function DataAnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [tourData, setTourData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [averageRating,setAverageRating] = useState(null)
  const [feedbackData, setFeedbackData] = useState([]);
  const [guidePerformanceData, setGuidePerformanceData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [toursRes, usersRes, feedbackRes] = await Promise.all([
        axios.get('http://localhost:5000/tours/list'),
        axios.get('http://localhost:5000/admin/users'),
        axios.get('http://localhost:5000/tours/feedbacks'),
      ]);

      const tours = toursRes.data.tours;
      const users = usersRes.data.users;
      const feedbacks = feedbackRes.data.feedbacks;
      const finishedTours = tours.filter((tour) => tour.status === 'completed');
      const finishedToursWithFeedback = finishedTours.filter((tour) => tour.tourPoint);
      let totalPoints = 0;
      let allSuitableTours = 0;
      let allToursWithPoint = finishedToursWithFeedback.length;
      finishedToursWithFeedback.forEach(tour => {
        totalPoints += tour.tourPoint;
        allSuitableTours++;
      });
      let averageofRating = totalPoints/allSuitableTours;
      setAverageRating(averageofRating)

      processTourData(tours);
      processUserData(users);
      processFeedbackData(feedbacks);
      processGuidePerformanceData(tours, feedbacks);

      processTourData(tours);
      processUserData(users);
      processFeedbackData(feedbacks);
      processGuidePerformanceData(tours, feedbacks);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Functions to process data and set state
  const processTourData = (tours) => {
    // Total Tours Over Time
    const toursByMonth = {};
    tours.forEach((tour) => {
      const month = moment(tour.date).format('YYYY-MM');
      toursByMonth[month] = (toursByMonth[month] || 0) + 1;
    });
  
    const toursOverTime = Object.keys(toursByMonth).map((month) => ({
      month,
      count: toursByMonth[month],
    })).sort((a, b) => new Date(a.month) - new Date(b.month));
  
    // Tours by Status
    const statusCounts = {};
    tours.forEach((tour) => {
      const status = tour.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
  
    const toursByStatus = Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));
  
    // Tours by City
    const cityCounts = {};
    tours.forEach((tour) => {
      const city = tour.city;
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
  
    const toursByCity = Object.keys(cityCounts).map((city) => ({
      city,
      count: cityCounts[city],
    }));
  
    // Tours per Time Slot
    const timeSlotCounts = {};
    tours.forEach((tour) => {
      const timeSlot = tour.hour;
      timeSlotCounts[timeSlot] = (timeSlotCounts[timeSlot] || 0) + 1;
    });
  
    const toursByTimeSlot = Object.keys(timeSlotCounts).map((slot) => ({
      timeSlot: slot,
      count: timeSlotCounts[slot],
    }));
  
    setTourData({
      toursOverTime,
      toursByStatus,
      toursByCity,
      toursByTimeSlot,
    });
  };

  const processUserData = (users) => {
    const roleCounts = {};
    users.forEach((user) => {
      const role = user.userType;
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
  
    const usersByRole = Object.keys(roleCounts).map((role) => ({
      name: role,
      value: roleCounts[role],
    }));
  
    setUserData({
      usersByRole,
    });
  };

  const processFeedbackData = (feedbacks) => {
    // Average Feedback Rating
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = (totalRating / feedbacks.length).toFixed(2);
  
    // Feedback Trends Over Time
    const feedbacksByMonth = {};
    feedbacks.forEach((feedback) => {
      const month = moment(feedback.date).format('YYYY-MM');
      feedbacksByMonth[month] = feedbacksByMonth[month] || { totalRating: 0, count: 0 };
      feedbacksByMonth[month].totalRating += feedback.rating;
      feedbacksByMonth[month].count += 1;
    });
  
    const feedbackTrends = Object.keys(feedbacksByMonth).map((month) => ({
      month,
      averageRating: (feedbacksByMonth[month].totalRating / feedbacksByMonth[month].count).toFixed(2),
    })).sort((a, b) => new Date(a.month) - new Date(b.month));
  
    setFeedbackData({
      averageRating,
      feedbackTrends,
    });
  };
  
  const processGuidePerformanceData = (tours, feedbacks) => {
    // Tours Handled per Guide
    const guideTourCounts = {};
    tours.forEach((tour) => {
      if (tour.attainedGuide) {
        const guideId = tour.attainedGuide._id;
        guideTourCounts[guideId] = guideTourCounts[guideId] || { name: tour.attainedGuide.username, count: 0 };
        guideTourCounts[guideId].count += 1;
      }
    });
  
    const toursPerGuide = Object.values(guideTourCounts);
  
    // Average Feedback per Guide
    const guideFeedbacks = {};
    feedbacks.forEach((feedback) => {
      const guideId = feedback.guide._id;
      guideFeedbacks[guideId] = guideFeedbacks[guideId] || { name: feedback.guide.username, totalRating: 0, count: 0 };
      guideFeedbacks[guideId].totalRating += feedback.rating;
      guideFeedbacks[guideId].count += 1;
    });
  
    const feedbackPerGuide = Object.values(guideFeedbacks).map((guide) => ({
      name: guide.name,
      averageRating: (guide.totalRating / guide.count).toFixed(2),
    }));
  
    setGuidePerformanceData({
      toursPerGuide,
      feedbackPerGuide,
    });
  };
  

  if (loading) {
    return <CircularProgress />;
  }
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Data Analysis 
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}></Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Total Tours Over Time</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tourData.toursOverTime}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Tours by Status</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tourData.toursByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  label
                >
                  {tourData.toursByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRandomColor()} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>



        <Grid item xs={12} md={6}>
  <Paper style={{ padding: 16 }}>
    <Typography variant="h6">Tours by City</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={tourData.toursByCity}>
        <XAxis dataKey="city" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
</Grid>



<Grid item xs={12} md={6}>
  <Paper style={{ padding: 16 }}>
    <Typography variant="h6">Users by Role</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={userData.usersByRole}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {userData.usersByRole.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getRandomColor()} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </Paper>
</Grid>




<Grid item xs={12} md={6}>
  <Paper style={{ padding: 16, textAlign: 'center' }}>
    <Typography variant="h6">Average Feedback Rating</Typography>
    <Typography variant="h2" color="primary">
      {averageRating} / 10
    </Typography>
  </Paper>
</Grid>




<Grid item xs={12} md={6}>
  <Paper style={{ padding: 16 }}>
    <Typography variant="h6">Feedback Trends Over Time</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={feedbackData.feedbackTrends}>
        <XAxis dataKey="month" />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <Line type="monotone" dataKey="averageRating" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
</Grid>




<Grid item xs={12}>
  <Paper style={{ padding: 16 }}>
    <Typography variant="h6">Tours Handled per Guide</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={guidePerformanceData.toursPerGuide}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
</Grid>




<Grid item xs={12}>
  <Paper style={{ padding: 16 }}>
    <Typography variant="h6">Average Feedback per Guide</Typography>
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={guidePerformanceData.feedbackPerGuide}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis angle={30} domain={[0, 5]} />
        <Radar name="Average Rating" dataKey="averageRating" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  </Paper>
</Grid>



      </Grid>
    </div>
  );
}

export default DataAnalysisPage;
