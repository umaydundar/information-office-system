import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Stack,
  Avatar,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function AssignGuidesForToursPage() {
  const [tourRequests, setTourRequests] = useState([]);
  const [guides, setGuides] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [completedTours,setCompletedTours] = useState([]);
  const [selectedTourId, setSelectedTourId] = useState(null);


  const fetchApprovedTours = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tours/list');
      const allTourRequests = response.data.tours;
      const approvedTours = allTourRequests.filter(
        (tour) => (tour.status === "approved" || tour.status === "assigned")
      )
      .map((tour) =>({
        ...tour,
        assignedGuideName: guides.find((guide) => guide._id ===  tour.attainedGuide?._id)?.username || "No guides assigned",
      }));
      console.log(approvedTours)
      setTourRequests(approvedTours);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };
  const moment = require('moment');
  const fetchCompletedTours = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tours/list');
      const allTourRequests = response.data.tours;
      const approvedTours = allTourRequests.filter(
        (tour) => tour.status === "completed"
      );
      setCompletedTours(approvedTours);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };
  useEffect(() => {
    // Fetch tours when classrooms are available to enrich data
    if (guides.length > 0) {
      fetchApprovedTours();
      fetchCompletedTours()
    }
  }, [guides]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        const guides = response.data.users.filter(
          (user) => (user.userType === "advisor" || user.userType === "guide")
        );
        setGuides(guides);
      } catch (error) {
        console.error('Error fetching guides:', error);
      }
    };

    fetchGuides();
  }, []);
  useEffect(() => {
    const setGuidePoints = async () => {
      try {
        for (const guide of guides) {
          const guidesId = guide._id;
          let totalPoints = 0;
          let numOfMatchingTours = 0;
  

          completedTours.forEach((tour) => {
            if (tour.attainedGuide._id === guidesId && tour.tourPoint) {
              console.log(tour)
              numOfMatchingTours++;
              totalPoints += tour.tourPoint;
            }
          });
  
          if (numOfMatchingTours !== 0) {
            await axios.put(`http://localhost:5000/admin/update-user/${guidesId}`, {
              score: totalPoints / numOfMatchingTours,
            });
          }
        }
      } catch (error) {
        console.error('Error updating guide points:', error);
      }
    };
  
    setGuidePoints();
  }, [guides, completedTours]); // Add dependencies to rerun when `guides` or `completedTours` change.
  

  const handleAssignGuide = (tourId) => {
    setSelectedTourId(tourId);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedTourId(null);
  };
  const assignGuideToTour = async (guideId) => {
    try {
      const response = await axios.put(`http://localhost:5000/tours/update/${selectedTourId}`, {
        attainedGuide: guideId,
        status: 'assigned',
      });
  
      if (response.status === 200) {
        alert('Guide assigned successfully!');
        fetchApprovedTours()
        closePopup();
      }
    } catch (error) {
      console.error('Error assigning guide:', error);
      alert('Failed to assign the guide. Please try again.');
    }
  };


  const columns = [
    { field: 'schoolName', headerName: 'High School', flex: 1 },
    { 
      field: 'date', 
      headerName: 'Date', 
      flex: 1,
      valueFormatter: (params) => {
        // Using moment to format the date
        const formattedDate = moment(params).format('DD/MM/YYYY');
        return formattedDate;
      },
    },
    { field: 'hour', headerName: 'Hour', flex: 1 },
    { field: 'numberOfStudents', headerName: 'Number of Students', flex: 1 },
    {field: 'assignedGuideName', headerName: 'Assigned Guide',flex: 1},
    {
      field: 'actions',
      headerName: 'Assign Guide',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAssignGuide(params.row._id)}
        >
          {params.row.attainedGuide ? "Change Guide" : "Assign Guide"}
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Assign Guides to a Tour
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

      <Dialog open={showPopup} onClose={closePopup} maxWidth="sm" fullWidth>
  <DialogTitle>Assign a Guide</DialogTitle>
  <DialogContent>
    {/* Table Header */}
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        paddingY: 1,
        borderBottom: '1px solid #ddd',
        marginBottom: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">Guide Name</Typography>
      <Typography variant="subtitle1" fontWeight="bold" textAlign="center">Requested the Tour</Typography>
      <Typography variant="subtitle1" fontWeight="bold" textAlign="center">Points</Typography>
      <Typography variant="subtitle1" fontWeight="bold" textAlign="center">Actions</Typography>
    </Box>
    {/* Guides List */}
    {guides.map((guide) => {
      const hasRequested = tourRequests.find((tour) => tour._id === selectedTourId)?.requestingGuides.includes(guide._id);
      return (
        <Box
        key={guide._id}
        sx={{
          display: 'grid',
          gridTemplateColumns: '60px 2fr 1fr 1fr 1fr', // Defined fixed and proportional columns
          alignItems: 'center',
          paddingY: 1,
          gap: 2, // Space between grid items
        }}
      >
        {/* Guide Avatar */}
        <Box display="flex" justifyContent="center">
          <Avatar
            src={guide.profilePic}
            alt={guide.username}
            sx={{ width: 60, height: 60 }}
          />
        </Box>
      
        {/* Guide Name */}
        <Typography textAlign="center">{guide.username}</Typography>
      
        {/* Requested the Tour */}
        <Box display="flex" justifyContent="center">
          {hasRequested ? (
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: 'green',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" color="white">
                ✓
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: 'red',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" color="white">
                ×
              </Typography>
            </Box>
          )}
        </Box>
      
        {/* Guide Score */}
        <Typography textAlign="center">{guide.score}</Typography>
      
        {/* Assign Button */}
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => assignGuideToTour(guide._id)}
          >
            Assign
          </Button>
        </Box>
      </Box>
      
      );
    })}
  </DialogContent>   
  <DialogActions>
    <Button onClick={closePopup} color="secondary" variant="outlined">
      Close
    </Button>
  </DialogActions>
  </Dialog>
    </Box>
  );
}

export default AssignGuidesForToursPage;
