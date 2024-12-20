import React, { useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import axios from 'axios';

function AnnouncementEditDialog({ announcement, onClose }) {

  const [formData, setFormData] = useState({
    summary:  "",
    description:  "",
  });  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
        await axios.post(`http://localhost:5000/announcements/add`,
          formData,
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
      <DialogTitle>{'Add Announcement'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Summary"
          name="summary"
          fullWidth
          value={formData.summary}
          onChange={handleChange}
        />
         <TextField
          margin="normal"
          label="Description"
          name="description"
          fullWidth
          value={formData.description}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AnnouncementEditDialog;
