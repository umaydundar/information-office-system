import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';

function RequestTourPage() {
  const navigate = useNavigate();
  const moment = require('moment');
  // Supervisor Information
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorTitle, setSupervisorTitle] = useState('');
  const [supervisorEmail, setSupervisorEmail] = useState('');
  const [supervisorPhoneNumber, setSupervisorPhoneNumber] = useState('');

  // Tour Information
  const [schoolsName, setSchoolsName] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [tourID,setTourID] = useState(null);
  const [numberOfStudentsInTour, setNumberOfStudentsInTour] = useState('');
  const [notes, setNotes] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = moment(date).format('YYYY-MM-DD');
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
      let tourSize = numberOfStudentsInTour;
      let tourTurn = 1;
      while(tourSize > 60){
        try{
          await axios.post('http://localhost:5000/tours/create', {
            schoolName : schoolsName + tourTurn,
            city,
            date,
            hour,
            numberOfStudents: 60,
            groupSupervisor: groupSupervisorId,
            notes,
            email: supervisorEmail,
          });
          tourSize -= 60;
          console.log("girdinmi bakalım");
          tourTurn++;
        }
        catch(error){
          console.error(error);
        }
      }
      let toursId;
        if(tourTurn > 1){
          const response = await axios.post('http://localhost:5000/tours/create', {
            schoolName: schoolsName + tourTurn,
            city,
            date,
            hour,
            numberOfStudents: tourSize,
            groupSupervisor: groupSupervisorId,
            notes,
            email: supervisorEmail,
          });
          toursId = response.data.tour._id;
        }
        else{
          const response = await axios.post('http://localhost:5000/tours/create', {
            schoolName: schoolsName,
            city,
            date,
            hour,
            numberOfStudents: tourSize,
            groupSupervisor: groupSupervisorId,
            notes,
            email: supervisorEmail,
          });
          console.log(response.data.tour._id)
          toursId = response.data.tour._id;
          console.log(toursId);
        }
        try {   
          console.log(toursId)
          setTimeout(() => { 
            emailjs.init(process.env.REACT_APP_MAIL_PUBLIC_ID_ONE);
            emailjs.send(process.env.REACT_APP_MAIL_SERVICE_ID_ONE, process.env.REACT_APP_MAIL_TEMPLATE_ID_APPLY, {
              from_name: "Bilkent Staff",
              tour_date: formattedDate,
              tour_hour: hour,
              to_name: "Bay/Bayan " + supervisorName,
              cancel_page: "http://localhost:3000/cancel-tour-request-page/?tourID=" + toursId,
              mail_to: supervisorEmail,
            });
          }, 500); 
        } catch (error) {
          console.error(error);
        }
      // Create tour request
      alert('Tour request submitted successfully!');
      navigate('/'); // Redirect to home or a success page
    } catch (error) {
      console.error(error);
      alert(error);
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
          Tur Talep Et
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
            Tour Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Okul İsmi"
                value={schoolsName}
                onChange={(e) => setSchoolsName(e.target.value)}
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
            <FormControl fullWidth required>
        <InputLabel id="time-select-label">Select Hour</InputLabel>
        <Select
          labelId="time-select-label"
          value={timeSlot}
          onChange={handleTimeChange}
          label="Saat Aralığı"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {generateCustomIntervals().map((time, index) => (
            <MenuItem key={index} value={time}>
              {time}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Öğrenci Sayısı"
                type="number"
                value={numberOfStudentsInTour}
                onChange={(e) => setNumberOfStudentsInTour(e.target.value)}
              />
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
            Tur Talebini Gönder
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RequestTourPage;
