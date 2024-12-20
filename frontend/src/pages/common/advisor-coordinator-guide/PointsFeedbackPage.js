import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import {
  Paper,
  Stack,
  Typography,
} from '@mui/material';


function PointsAndFeedbackPage() {

  const [guides, setGuides] = useState([]);
  const [guidesTours, setGuidesTours] = useState([]);
  const [userId, setUserId] = useState(null); 


  useEffect(() => {
    fetchUsers();
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user.id); 
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchGuides = async () => {
        try {
          const response = await axios.get('http://localhost:5000/admin/users', {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          });
          const allGuides = response.data.users.filter(
            (user) => (user.userType === "guide" || user.userType === "advisor")
          );
          setGuides(allGuides);
        } catch (error) {
          console.error('Error fetching guides:', error);
        }
      };
  
      fetchGuides();
    } catch (error) {
      console.error(error);
    }
  };

  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    const fetchApprovedTours = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tours/list');
        const allTourRequests = response.data.tours;
        const completedTours = allTourRequests.filter(
            (tour) => tour.attainedGuide && tour.status === "completed" && tour.attainedGuide._id === userId
          );          
        console.log(completedTours)
        setGuidesTours(completedTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };
    fetchApprovedTours();
  },[userId])

  useEffect(() => {
    fetchFeedbacks();
  }, [userId]);

  /*const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/guidefeedbacks/feedback', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setFeedbacks(res.data.feedbacks.find({ userType: "guide" }));
    } catch (error) {
      console.error(error);
    }
  };*/

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tours/list');
      const allTourRequests = response.data.tours;
      const completedTours = allTourRequests.filter(
          (tour) => tour.attainedGuide && tour.status === "completed" && tour.attainedGuide._id === userId
        );          
        setFeedbacks(completedTours.toursFeedback);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const columns1 = [
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'userType', headerName: 'Role', flex: 1 },
    { field: 'score', headerName: 'Score', flex: 1 },
    { field: 'rank', headerName: 'Rank', flex: 1 },
  ];

  const columns2 = [
    { field: 'schoolName', headerName: 'High School', flex: 1 },
    { 
      field: 'toursFeedback', 
      headerName: 'Feedback', 
      flex: 1, 
      renderCell: (params) => params.value || "No feedback given yet",
    },
    {
      field: 'tourPoint',
      headerName: 'Tour Point',
      flex: 1,
      renderCell: (params) => params.value || "No feedback given yet",
    },
  ];

  return (
<div style={{ padding: 16 }}>
<Typography variant="h4" gutterBottom>
        Points & Feedback
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}></Stack>
      <Paper elevation={3} sx={{ height: 500, width: '100%', marginBottom: 2 }}>
        <DataGrid
          rows={guidesTours}
          columns={columns2}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row._id}
        />
      </Paper>
</div>
    
  );
}

export default PointsAndFeedbackPage;