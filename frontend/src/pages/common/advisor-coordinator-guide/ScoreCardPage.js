import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { jwtDecode } from "jwt-decode";
import {
  Stack,
  Typography,
  Paper,
  Grid,
  Box,
} from '@mui/material';
import axios from 'axios';

function ScoreCardPage() {
  const [tours, setTours] = useState([]);
  const [userId, setUserId] = useState(null);
  const [score, setScore] = useState([]);
  const [totalPoints, setTotalPoints] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user.id);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    if (userId) {
      fetchTours();
    }
  }, [userId]);


  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        const guides = response.data.users.filter(
          (user) => user.userType === "advisor" || user.userType === "guide"
        );

          const currentGuide = guides.find(
            (guide) => guide._id === userId
          );
          if (currentGuide) {
            console.log(currentGuide.score); // Debugging log
            setScore(currentGuide.score); // Set the score to state
          } else {
            console.warn("No guide found with the specified userId");
            setScore(null); // Reset score if guide not found
          }
        } catch (error) {
          console.error("Error fetching guides:", error);
        }
      };
    fetchGuides(); 
  }, [userId]); 
  

  const fetchTours = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tours/list');
      const allTours = response.data.tours;
      const approvedTours = allTours.filter(
        (tour) => ((tour.status === "assigned" || tour.status === "completed") && tour.attainedGuide?._id === userId) 
      );

      if (approvedTours.length === 0) {
        console.log('No approved tours found.');
        setTotalPoints(0); 
        return;
      }
    
      const totalPoints = approvedTours.reduce((acc, tour) => { //sum the points
        return acc + (tour.tourPoint || 0);
      }, 0);

      setTotalPoints(totalPoints);

      setTours(approvedTours);
      
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };
  
  const moment = require('moment');

  const columns = [
    { field: 'schoolName', headerName: 'School Name', flex: 1 },
    { 
      field: 'date', 
      headerName: 'Date', 
      flex: 1,
      valueFormatter: (params) => {
        // Using moment to format the date
        const formattedDate = moment(params).format('DD/MM/YYYY');
        return formattedDate;
      }, // Format the date
    },
    { field: 'hour', headerName: 'Time', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
  ];
  

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Scorecard
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}>
      </Stack>
      <div style={{ height: 600 }}>

      <Grid container spacing={0} ustifyContent="flex-start" style={{ marginBottom: 16 }}>
    <Grid item xs={6}>
    
      <Paper elevation={3} style={{ padding: 30, height: 100, width: 550 }}>
      <Box display="flex" alignItems="center">
  <Typography variant="h5">Total Points:</Typography>
  <Typography variant="h5" style={{ marginLeft: 8 }}>
    {totalPoints !== null ? totalPoints : 0}
  </Typography>
</Box>
      </Paper>
    </Grid>
    <Grid item xs={6}>
    <Paper elevation={3} style={{ padding: 30, height: 100, width: 600 }}>
      <Box display="flex" alignItems="center">
  <Typography variant="h5">Average Points:</Typography>
  <Typography variant="h5" style={{ marginLeft: 8 }}>
    {score !== null ? score : 0}
  </Typography>
</Box>
      </Paper>
    </Grid>
  </Grid>

      <Paper elevation={3} sx={{ height: 500, width: '100%', marginBottom: 2 }}>
        <DataGrid
          rows={tours.map((tour) => ({ ...tour, id: tour._id }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          getRowId={(row) => row._id}
        />
        </Paper>
    </div>
     
    </div>
  );
}

export default ScoreCardPage;
