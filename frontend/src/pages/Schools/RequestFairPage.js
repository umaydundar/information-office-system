import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';

function RequestFairPage() {
  const navigate = useNavigate();
  const moment = require('moment');

  // Supervisor Information
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorTitle, setSupervisorTitle] = useState('');
  const [supervisorEmail, setSupervisorEmail] = useState('');
  const [supervisorPhoneNumber, setSupervisorPhoneNumber] = useState('');


  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [notes, setNotes] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if supervisor exists
      const supervisorRes = await axios.post(
        'http://localhost:5000/group-supervisor/find-or-create',
        {
          name: supervisorName,
          title: supervisorTitle,
          email: supervisorEmail,
          phoneNumber: supervisorPhoneNumber,
        }
      );

      const groupSupervisorId = supervisorRes.data.groupSupervisor._id;

      // Create fair request
      await axios.post('http://localhost:5000/fairs/create', {
        schoolName,
        city,
        date,
        hour,
        groupSupervisor: groupSupervisorId,
        notes,
        email: supervisorEmail,
      });
      emailjs.init(process.env.REACT_APP_MAIL_PUBLIC_ID_FOUR);
      const formattedDate = moment(date).format('YYYY-MM-DD');
            emailjs.send(process.env.REACT_APP_MAIL_SERVICE_ID_FOUR, process.env.REACT_APP_MAIL_TEMPLATE_FAIR_APPLICATION, {
              from_name: "Bilkent Staff",
              fair_date: formattedDate,
              fair_hour: hour,
              to_name: "Bay/Bayan " + supervisorName,
              mail_to: supervisorEmail,
            });

      alert('Fair request submitted successfully!');
      navigate('/'); 
    } catch (error) {
      console.error(error);
      alert('Error submitting fair request. Please try again.');
    }
  };

  const generateCustomIntervals = () => {
    const intervals = [
        { start: "09:00", end: "11:00" },
        { start: "11:00", end: "13:30" },
        { start: "13:30", end: "16:00" },
        { start: "16:00", end: "18:00" },
    ];

    return intervals.map(({ start, end }) => `${start} - ${end}`);
};

  const handleTimeChange = (event) => {
    const selectedTimeSlot = event.target.value; 
    const formattedTimeSlot = selectedTimeSlot.replace(/\s+/g, ''); // Removes all spaces
    setTimeSlot(selectedTimeSlot);
    setHour(formattedTimeSlot);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Fuar Talep Et
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Grup Sorumlusu Bilgisi
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="İsim"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Unvan"
                value={supervisorTitle}
                onChange={(e) => setSupervisorTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={supervisorEmail}
                onChange={(e) => setSupervisorEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Telefon Numarası"
                value={supervisorPhoneNumber}
                onChange={(e) => setSupervisorPhoneNumber(e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ marginTop: 4 }}>
            Fuar Bilgisi
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Okul İsmi"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Şehir"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Tarih"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                label="Saat Aralığı"
                name="hour"
                select
                fullWidth
                value={timeSlot}
                onChange={handleTimeChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {generateCustomIntervals().map((time, index) => (
                  <MenuItem key={index} value={time}>
                    {time}
                </MenuItem>
                ))}     
              </TextField>
                
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notlar"
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
          >
            Fuar Talebini Gönder
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RequestFairPage;
