import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import dayjs from 'dayjs'
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { jwtDecode } from "jwt-decode";
import { DataGrid } from '@mui/x-data-grid';

function FinishTour() {
  const [tourRequests, setTourRequests] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState(null); 
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [columns,setColumns] = useState([]);


  const moment = require('moment');

  useEffect(() => {
    const fetchApprovedTours = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tours/list');
        const allTourRequests = response.data.tours;
        const approvedTours = allTourRequests.filter(
            (tour) => tour.status === "assigned" && tour.attainedGuide._id === userId
          );          
        console.log(approvedTours)
        setTourRequests(approvedTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };
    fetchApprovedTours();
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user.id); 
    }
  }, []);

  

  const handleClick = (tourId) => {
    setSelectedTourId(tourId);
    setShowPopup(true);
  };



  const closePopup = () => {
    setShowPopup(false);
    setSelectedTourId(null);
  };
  const handleYes = async () => {
      try{
        const response = await axios.put(`http://localhost:5000/tours/update/${selectedTourId}`, {
          status: "completed"
        });
        try{
            const selectedTour = tourRequests.find((tour) => tour._id === selectedTourId);
            console.log(selectedTour);
            emailjs.init(process.env.REACT_APP_MAIL_PUBLIC_ID_TWO);
            emailjs.send(process.env.REACT_APP_MAIL_SERVICE_ID_TWO,process.env.REACT_APP_MAIL_TEMPLATE_ID_FEEDBACK,{
            from_name: "Bilkent Staff",
            to_name: "Dear teacher",
            survey_link: "http://localhost:3000/give-points-feedback-page/?tourID=" + selectedTourId,
            mail_to: selectedTour.email,
            });
          }
          catch(error){
            console.log(error)
          }
        setTourRequests((prev) =>
          prev.map((tour) =>
            tour._id === selectedTourId
              ? { ...tour, status: "completed" }
              : tour
          )
        );
      }
      catch (error) {
        console.error('Error finishing the tour:', error);
        alert('Failed to finish the tour. Please try again.');
      }
    setShowPopup(false)
    setSelectedTourId(null)
  }

  useEffect(() => {
    const currentColumns = [
      { field: 'schoolName', headerName: 'High School', flex: 1 },
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
      { field: 'hour', headerName: 'Hour', flex: 1 },
      { field: 'numberOfStudents', headerName: 'Number of Students', flex: 1 },
      {
        field: 'actions',
        headerName: 'Action',
        flex: 1,
        renderCell: (params) => (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClick(params.row._id)} // Add parentheses to handleClick here
          >
            Finish Tour
          </Button>
        ),
      },
    ];
    setColumns(currentColumns);
  }, [tourRequests]); // Add an empty dependency array to run the effect only once
  

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Finish a Tour
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}></Stack>
      <Paper elevation={3} sx={{ height: 500, width: '100%', marginBottom: 2 }}>
        <DataGrid
          rows={tourRequests.map((tour) => ({ ...tour, id: tour._id }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </Paper>

      <Dialog open={showPopup} onClose={closePopup}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>
            Do you confirm your action?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} color="secondary">
            No
          </Button>
          <Button onClick={handleYes} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FinishTour;
