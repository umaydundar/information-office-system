import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { Visibility, VisibilityOff, Refresh as RefreshIcon } from '@mui/icons-material';

function UserEditDialog({ user, onClose }) {
  const isEditing = Boolean(user);

  const [formData, setFormData] = useState({
    username: isEditing ? user.username : '',
    email: isEditing ? user.email : '',
    password: '',
    userType: isEditing ? user.userType : '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setFormData({
      ...formData,
      password: randomPassword,
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/admin/update-user/${user._id}`,
          formData,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
      } else {
        const response = await axios.post(
          `http://localhost:5000/admin/create-user`,
          formData,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        const { email, username } = response.data;
        const encodedMail = encodeURIComponent(email);
        emailjs.init(process.env.REACT_APP_MAIL_PUBLIC_ID_THREE);
        emailjs.send(
          process.env.REACT_APP_MAIL_SERVICE_ID_THREE,
          process.env.REACT_APP_MAIL_TEMPLATE_ID_SET_PASSWORD,
          {
            from_name: "Bilkent Staff",
            given_username: username,
            application_link: `http://localhost:3000/forgot-password-mail/?username=${username}&emailInput=${encodedMail}`,
            mail_to: email,
          }
        );
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/admin/delete-user/${user._id}`,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Username"
          name="username"
          fullWidth
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="Email"
          name="email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        {!isEditing && (
          <TextField
            margin="normal"
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    <IconButton onClick={generateRandomPassword}>
                      <RefreshIcon />
                    </IconButton>
                  </InputAdornment>
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                </>
              ),
            }}
          />
        )}
        <TextField
          margin="normal"
          label="Role"
          name="userType"
          select
          fullWidth
          value={formData.userType}
          onChange={handleChange}
        >
          <MenuItem value="guide">Guide</MenuItem>
          <MenuItem value="advisor">Advisor</MenuItem>
          <MenuItem value="coordinator">Coordinator</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        {isEditing && (
          <Button onClick={handleDelete} color="error">
            Delete User
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserEditDialog;
