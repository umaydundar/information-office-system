import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  CircularProgress,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import WeeklyScheduleModal from '../../../components/WeeklyScheduleModal';
import { styled } from '@mui/system';

const ProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [changedUser, setChangedUser] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = [
    '08:30-09:20',
    '09:20-10:30',
    '10:30-11:20',
    '11:20-12:30',
    '13:20-14:10',
    '14:10-15:00',
    '15:00-15:50',
    '16:30-17:20',
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user.id);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/users`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      const foundUser = res.data.users.find((u) => u._id === userId);
      setUser(foundUser);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setChangedUser({
      username: user.username || '',
      // Show '********' if not editing, but now we are editing, we assume we got the password or empty
      password: user.password || '', 
      name: user.name || '',
      surname: user.surname || '',
      phone: user.phone || '',
      email: user.email || '',
      userType: user.userType || '',
      profilePic: user.profilePic || '',
      weeklySchedule: user.weeklySchedule || Array(5).fill().map(() => Array(8).fill(0)),
    });
    setIsEditable(true);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setChangedUser((prevUser) => ({ ...prevUser, [id]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/user/update-user/${user._id}`, changedUser, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setUser(res.data.user);
      setIsEditable(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleCancel = () => {
    setIsEditable(false);
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const res = await axios.post(`http://localhost:5000/user/upload-profile-pic/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setChangedUser((prev) => ({ ...prev, profilePic: res.data.user.profilePic }));
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleOpenScheduleModal = () => {
    setScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = (newSchedule) => {
    setScheduleModalOpen(false);
    if (newSchedule) {
      setChangedUser((prev) => ({ ...prev, weeklySchedule: newSchedule }));
    }
  };

  if (loading) {
    return (
      <Container style={{ marginTop: 20, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container style={{ marginTop: 20 }}>
        <Typography variant="h5">User not found or not logged in</Typography>
      </Container>
    );
  }

  const currentData = isEditable ? changedUser : user;

  const AvatarContainer = styled('div')({
    position: 'relative',
    width: 'fit-content',
    '&:hover .overlay': {
      opacity: 1,
    }
  });

  const Overlay = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    cursor: 'pointer'
  });

  return (
    <Container maxWidth="lg" style={{ marginTop: 20 }}>
      <Grid container spacing={4}>
        {/* Left Container */}
        <Grid item xs={12} md={6} style={{ position: 'relative' }}>
          <Card>
            <CardContent style={{ position: 'relative' }}>
              {!isEditable && (
                <IconButton 
                  onClick={handleEdit} 
                  style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#eee' }}
                >
                  <EditIcon />
                </IconButton>
              )}
              {isEditable && (
                <IconButton 
                  onClick={handleCancel} 
                  style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#eee' }}
                >
                  X
                </IconButton>
              )}

              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <AvatarContainer>
                    <Avatar src={currentData.profilePic} alt={currentData.username} sx={{ width: 80, height: 80 }} />
                    {isEditable && (
                      <>
                        <Overlay className="overlay">
                          <ControlPointIcon style={{ fontSize: 40, color: 'white' }}       />
                          <input
                            type="file"
                            style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            onChange={handleProfilePicUpload}
                          />
                        </Overlay>
                      </>
                    )}
                  </AvatarContainer>
                </Grid>
                <Grid item xs>
                  {isEditable ? (
                    <TextField
                      fullWidth
                      id="username"
                      label="Username"
                      value={currentData.username}
                      onChange={handleInputChange}
                      InputProps={{ readOnly: !isEditable }}
                    />
                  ) : (
                    <Typography variant="h6">{currentData.username}</Typography>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={2} style={{ marginTop: 20 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="name"
                    label="Name"
                    value={currentData.name}
                    onChange={isEditable ? handleInputChange : undefined}
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="surname"
                    label="Surname"
                    value={currentData.surname}
                    onChange={isEditable ? handleInputChange : undefined}
                    InputProps={{ readOnly: !isEditable }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                value={isEditable ? currentData.password : '********'}
                onChange={isEditable ? handleInputChange : undefined}
                InputProps={{ readOnly: !isEditable }}
                style={{ marginTop: 20 }}
              />

              <TextField
                fullWidth
                id="phone"
                label="Phone Number"
                value={currentData.phone}
                onChange={isEditable ? handleInputChange : undefined}
                InputProps={{ readOnly: !isEditable }}
                style={{ marginTop: 20 }}
              />

              <TextField
                fullWidth
                id="email"
                label="Email"
                value={currentData.email}
                onChange={isEditable ? handleInputChange : undefined}
                InputProps={{ readOnly: !isEditable }}
                style={{ marginTop: 20 }}
              />

              <TextField
                fullWidth
                id="userType"
                label="User Type"
                value={currentData.userType}
                InputProps={{ readOnly: true }}
                style={{ marginTop: 20 }}
              />

              {isEditable && (
                <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: 20 }}>
                  Save
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Container */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>Weekly Schedule</Typography>
          <Card>
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    {days.map((day, i) => (
                      <TableCell key={i} align="center">{day}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hours.map((hour, hourIndex) => (
                    <TableRow key={hourIndex}>
                      <TableCell>{hour}</TableCell>
                      {currentData.weeklySchedule.map((dayRow, dayIndex) => {
                        const val = dayRow[hourIndex];
                        return (
                          <TableCell key={dayIndex} style={{
                            backgroundColor: val === 1 ? 'green' : 'transparent',
                            width: '50px',
                            height: '30px'
                          }}>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            {isEditable && (
              <div style={{ padding: '10px' }}>
                <Button variant="contained" onClick={handleOpenScheduleModal}>
                  Edit Schedule
                </Button>
              </div>
            )}
          </Card>
        </Grid>
      </Grid>

      <WeeklyScheduleModal
        open={scheduleModalOpen}
        onClose={handleCloseScheduleModal}
        initialSchedule={currentData.weeklySchedule}
      />
    </Container>
  );
};

export default ProfilePage;
