import React, { useState, useEffect } from 'react';
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
import { DataGrid } from '@mui/x-data-grid';

function AssignTourClassroomPage() {
  const [tourRequests, setTourRequests] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedTourId, setSelectedTourId] = useState(null);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/class/classes');
      setClassrooms(response.data.classroom);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const moment = require('moment');
  
  useEffect(() => {
    if (classrooms.length > 0) {
      fetchAndUpdateTours();
    }
  }, [classrooms]); 
  

  const fetchAndUpdateTours = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tours/list');
      const allTourRequests = response.data.tours;

      // Filter tours and add classroom name
      const approvedTours = allTourRequests
        .filter((tour) => tour.status === 'approved' || tour.status === 'assigned')
        .map((tour) => ({
          ...tour,
          assignedClassName: classrooms.find((cls) => cls._id === tour.assignedClass)?.name || 'Not Assigned',
        }));

      setTourRequests(approvedTours);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const handleAssignClassroom = (tourId) => {
    setSelectedTourId(tourId);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedTourId(null);
  };

  const assignClassroomToTour = async (classroomId) => {
    try {
      const response = await axios.put(`http://localhost:5000/tours/update/${selectedTourId}`, {
        assignedClass: classroomId,
      });

      if (response.status === 200) {
        alert("Class successfully added");
        fetchAndUpdateTours();
        closePopup();  // Close the popup
      }
    } catch (error) {
      console.error('Error assigning classroom:', error);
      alert('Failed to assign the classroom. Please try again.');
    }
  };

  // Set the columns for DataGrid
  useEffect(() => {
    const currentColumns = [
      { field: 'schoolName', headerName: 'High School', flex: 1 },
      { field: 'date', headerName: 'Date', flex: 1,
        valueFormatter: (params) => {
          // Using moment to format the date
          const formattedDate = moment(params).format('DD/MM/YYYY');
          return formattedDate;
        },
       },
      { field: 'hour', headerName: 'Hour', flex: 1 },
      { field: 'numberOfStudents', headerName: 'Number of Students', flex: 1 },
      {field:  'assignedClassName', headerName: 'Current Classroom', flex: 1},
      {
        field: 'actions',
        headerName: 'Assign Classroom',
        flex: 1,
        renderCell: (params) => (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAssignClassroom(params.row._id)}
          >
            {params.row.assignedClass ? "Change Class" : "Assign Class"}
          </Button>
        ),
      },
    ];
    setColumns(currentColumns);
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Assign Classroom to a Tour Page
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}></Stack>
      <Paper elevation={3} sx={{ height: 400, width: '100%', marginBottom: 2 }}>
        <DataGrid
          rows={tourRequests.map((tour) => ({ ...tour, id: tour._id }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </Paper>

      <Dialog open={showPopup} onClose={closePopup} maxWidth="sm" fullWidth>
        <DialogTitle>Assign a Classroom</DialogTitle>
        <DialogContent>
          {classrooms.map((classroom) => (
            <Box
              key={classroom._id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingY: 1,
              }}
            >
              <Typography>{classroom.name}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => assignClassroomToTour(classroom._id)}
              >
                Assign
              </Button>
            </Box>
          ))}
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

export default AssignTourClassroomPage;
