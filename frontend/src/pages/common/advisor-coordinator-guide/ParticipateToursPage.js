import React, { useState, useEffect } from 'react';
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

function AssignGuidesForToursPage() {
  const [tourRequests, setTourRequests] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [adding,setAdding] = useState(null);
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
          (tour) => tour.status === "approved"
        );
        setTourRequests(approvedTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };
    fetchApprovedTours();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user.id); 
    }
  }, []);

  

  const handleClickRemoval = (tourId) => {
    setSelectedTourId(tourId);
    setAdding(false);
    setShowPopup(true);
  };

  const handleClickAddition = (tourId) => {
    setSelectedTourId(tourId);
    setAdding(true);
    setShowPopup(true);
  };


  const closePopup = () => {
    setShowPopup(false);
    setSelectedTourId(null);
  };
  const handleYes = async () => {
    if(adding){
      try{
        const response = await axios.put(`http://localhost:5000/tours/update/${selectedTourId}`, {
          $push: { requestingGuides: userId},
        });
        setTourRequests((prev) =>
          prev.map((tour) =>
            tour._id === selectedTourId
              ? { ...tour, requestingGuides: [...tour.requestingGuides, userId] }
              : tour
          )
        );
      }
      catch (error) {
        console.error('Error assigning guide:', error);
        alert('Failed to assign the guide. Please try again.');
      }
    }
    else{
      try {
        const response = await axios.put(`http://localhost:5000/tours/update/${selectedTourId}`, {
            $pull: { requestingGuides: userId },
        });
        setTourRequests((prev) =>
          prev.map((tour) =>
            tour._id === selectedTourId
              ? {
                  ...tour,
                  requestingGuides: tour.requestingGuides.filter(
                    (id) => id !== userId
                  ),
                }
              : tour
          )
        );
    } catch (error) {
        console.error('Error removing guide:', error);
        alert('Failed to remove the guide. Please try again.');
    }
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
            onClick={params.row.requestingGuides.includes(userId) ? () => handleClickRemoval(params.row._id) : () => handleClickAddition(params.row._id)}
          >
            {params.row.requestingGuides.includes(userId) ? "Remove tour request" : "Request tour"}
          </Button>
        ),
      },
    ];
    setColumns(currentColumns)
  })

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Request Participation in a Tour
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

export default AssignGuidesForToursPage;
