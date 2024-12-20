import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  IconButton,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ClassroomEditDialog from './ClassroomEditDialog';
import axios from 'axios';

function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/class/classes', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setClassrooms(res.data.classroom);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (classroom) => {
    setSelectedClassroom(classroom);
  };

  const handleDialogClose = () => {
    setSelectedClassroom(null);
    setIsAddDialogOpen(false);
    fetchClassrooms(); 
  };

  const columns = [
    { field: 'name', headerName: 'Classroom Name', flex: 1 },
    { field: 'building', headerName: 'Building', flex: 1 },
    { field: 'hours', headerName: 'Available hours', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditClick(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Classrooms
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Classroom
        </Button>
      </Stack>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}></Stack>
      <Paper elevation={3} sx={{ height: 450, width: '100%', marginBottom: 2 }}>
        <DataGrid
          rows={classrooms}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row._id}
        />
      </Paper>
      {selectedClassroom && (
        <ClassroomEditDialog classroom={selectedClassroom} onClose={handleDialogClose} />
      )}
      {isAddDialogOpen && (
        <ClassroomEditDialog classroom={null} onClose={handleDialogClose} />
      )}
    </div>
  );
}

export default ClassroomsPage;
