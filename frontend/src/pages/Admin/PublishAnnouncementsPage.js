import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AnnouncementEditDialog from './AnnouncementEditDialog';
import axios from 'axios';

function PublishAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/announcements/list', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setAnnouncements(res.data.announcements);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    fetchAnnouncements(); 
  };

  const columns = [
    { field: 'summary', headerName: 'Summary', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Announcements
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Announcement
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}></Stack>
      <Paper elevation={3} sx={{ height: 450, width: '100%', marginBottom: 2 }}>
        <DataGrid
          rows={announcements}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          getRowId={(row) => row._id}
        />
        </Paper>
     
      {isAddDialogOpen && (
        <AnnouncementEditDialog announcement={null} onClose={handleDialogClose} />
      )}
    </div>
  );
}

export default PublishAnnouncementsPage;
