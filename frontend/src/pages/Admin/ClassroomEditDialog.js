import React, { useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
} from '@mui/material';
import axios from 'axios';


function ClassroomEditDialog({ classroom, onClose }) {
  const isEditing = Boolean(classroom);

  const [formData, setFormData] = useState({
    name: isEditing ? classroom.name : "",
    building: isEditing ? classroom.building : "",
    status: isEditing ? classroom.status : "",
    hours: isEditing ? classroom.hours.replace(/\s+/g, ' ') : "",
  });  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        console.log(classroom._id);
        await axios.put(`http://localhost:5000/class/update/${classroom._id}`,
          formData,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
      } else {
        await axios.post(`http://localhost:5000/class/create`,
          formData,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
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
      await axios.delete(`http://localhost:5000/class/delete/${classroom._id}`,
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
      <DialogTitle>{isEditing ? 'Edit Classroom' : 'Add Classroom'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Name"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
         <TextField
          margin="normal"
          label="Building"
          name="building"
          fullWidth
          value={formData.building}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="Status"
          name="status"
          select
          fullWidth
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="assigned">Assigned</MenuItem>
          <MenuItem value="in-use">In Use</MenuItem>
        </TextField>
        
        <TextField
          margin="normal"
          label="Hours"
          name="hours"
          select
          fullWidth
          value={formData.hours}
          onChange={handleChange}
        >
          <MenuItem value="09:00-11:00">09:00-11:00</MenuItem>
          <MenuItem value="11:00-13:30">11:00-13:30</MenuItem>
          <MenuItem value="13:30-16:00">13:30-16:00</MenuItem>
          <MenuItem value="16:00-18:00">16:00-18:00</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        {isEditing && (
          <Button onClick={handleDelete} color="error">
            Delete Classroom
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

export default ClassroomEditDialog;
