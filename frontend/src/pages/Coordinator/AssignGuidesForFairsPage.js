import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import axios from 'axios';

function AssignGuidesForFairsPage() {
  const [fairRequests, setFairRequests] = useState([]);
  const [guides, setGuides] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFairId, setSelectedFairId] = useState(null);

  useEffect(() => {
    const fetchFairs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/fairs/list');
        const allFairRequests = response.data.fairs;
        const approvedFairs = allFairRequests.filter(
          (fair) => fair.status === 'approved' && !fair.attainedGuide
        );
        console.log(approvedFairs);
        setFairRequests(approvedFairs);
      } catch (error) {
        console.error('Error fetching fairs:', error);
      }
    };

    fetchFairs();
  }, []);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        const guides = response.data.users.filter(
          (user) => user.userType === 'advisor' || user.userType === 'guide'
        );
        setGuides(guides);
      } catch (error) {
        console.error('Error fetching guides:', error);
      }
    };

    fetchGuides();
  }, []);

  const handleAssignGuide = (fairId) => {
    setSelectedFairId(fairId);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedFairId(null);
  };

  const assignGuideToFair = async (guideId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/fairs/update/${selectedFairId}`,
        {
          attainedGuide: guideId,
        }
      );

      if (response.status === 200) {
        alert('Guide assigned successfully!');
        setFairRequests((prevRequests) =>
          prevRequests.map((fair) =>
            fair._id === selectedFairId
              ? { ...fair, attainedGuide: guideId }
              : fair
          )
        );
        closeDialog();
      }
    } catch (error) {
      console.error('Error assigning guide:', error);
      alert('Failed to assign the guide. Please try again.');
    }
  };

  const columns = [
    { field: 'schoolName', headerName: 'High School', flex: 1, minWidth: 150 },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => dayjs(params.value).format('DD/MM/YYYY'),
    },
    { field: 'hour', headerName: 'Hour', flex: 1, minWidth: 100 },
    {
      field: 'assignGuide',
      headerName: 'Assign Guide',
      sortable: false,
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAssignGuide(params.row._id)}
        >
          Assign Guide
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Assign Guides to a Fair
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}></Stack>
      <div style={{ height: 600 }}>
      <Paper elevation={3} sx={{ height: 500, width: '100%', marginBottom: 2 }}>
        <DataGrid
          rows={fairRequests}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row._id}
          autoPageSize
          sx={{
            backgroundColor: 'white', // Set the background color of the DataGrid itself
            borderRadius: 2, // Optional: Adds rounded corners
            boxShadow: 2, // Optional: Adds shadow for better look
          }}
        />
        </Paper>
      </div>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Assign a Guide</DialogTitle>
        <DialogContent>
          <List>
            {guides.map((guide) => (
              <ListItem
                key={guide._id}
                button
                onClick={() => assignGuideToFair(guide._id)}
              >
                <ListItemText primary={guide.username} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AssignGuidesForFairsPage;
