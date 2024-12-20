import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const TodaysToursAndFairsPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [todaysTours, setTodaysTours] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Decode token to get user info
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      // decoded.user.id, decoded.user.userType, etc.
      setUserInfo(decoded.user || null);
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all tours
      const toursRes = await axios.get('http://localhost:5000/tours/list');
      const allTours = toursRes.data.tours;

      // Filter today's approved tours
      const todayStr = moment().format('YYYY-MM-DD');
      const todaysApprovedTours = allTours.filter(tour => {
        const tourDateStr = moment(tour.date).format('YYYY-MM-DD');
        return (tour.status === 'approved' || tour.status === "assigned" )&& tourDateStr === todayStr;
      });
      setTodaysTours(todaysApprovedTours);

      // Fetch announcements
      const annRes = await axios.get('http://localhost:5000/announcements/list');
      setAnnouncements(annRes.data.announcements || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '30px' }}>
      <Typography variant="h4" gutterBottom>
        Welcome{userInfo && userInfo.userType ? `, ${userInfo.userType.toUpperCase()}!` : '!'}
      </Typography>

      <Grid container spacing={3}>
        {/* Announcements Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Announcements
              </Typography>
              {announcements.length > 0 ? (
                <List>
                  {announcements.map((ann, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={ann.summary}
                          secondary={`${ann.description} - ${moment(ann.date).format('MMM D, YYYY')}`}
                        />
                      </ListItem>
                      {index < announcements.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">
                  No announcements at the moment.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Tours Section */}
        <Grid item xs={12} md={8}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Today's Approved Tours
            </Typography>
            {todaysTours.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>School Name</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Hour</TableCell>
                    <TableCell>Number of Students</TableCell>
                    <TableCell>Guide</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todaysTours.map((tour) => (
                    <TableRow key={tour._id}>
                      <TableCell>{tour.schoolName}</TableCell>
                      <TableCell>{tour.city}</TableCell>
                      <TableCell>{tour.hour}</TableCell>
                      <TableCell>{tour.numberOfStudents}</TableCell>
                      <TableCell>
                        {tour.attainedGuide && tour.attainedGuide.username
                          ? tour.attainedGuide.username
                          : 'Not assigned'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body1">
                No approved tours for today.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TodaysToursAndFairsPage;
