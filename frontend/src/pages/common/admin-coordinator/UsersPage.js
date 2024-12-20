import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  IconButton,
  Stack,
  Paper,
  Typography,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import UserEditDialog from '../../../components/UserEditDialog';
import axios from 'axios';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/users', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  const handleDialogClose = () => {
    setSelectedUser(null);
    setIsAddDialogOpen(false);
    fetchUsers(); // Refresh user list
  };

  const columns = [
    {
      field: 'profilePic',
      headerName: 'Profile Picture',
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Avatar src={params.value} alt={params.row.username} />
        </div>
      ),
      width: 120,
      sortable: false,
    },
    { field: 'username', headerName: 'ID', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'password',
      headerName: 'Password',
      renderCell: () => '******', // Censor password
      width: 120,
      sortable: false,
    },
    { field: 'totalTours', headerName: 'Total Tours', width: 150 },
    { field: 'userType', headerName: 'Role', flex: 1 },
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
        Users
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add User
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ height: 500, width: '100%', marginBottom: 2 }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          getRowId={(row) => row._id}
        />
      </Paper>

      {selectedUser && (
        <UserEditDialog user={selectedUser} onClose={handleDialogClose} />
      )}
      {isAddDialogOpen && (
        <UserEditDialog user={null} onClose={handleDialogClose} />
      )}
    </div>
  );
}

export default UsersPage;
