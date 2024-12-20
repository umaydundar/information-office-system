import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../../index.css';
import { Typography, Stack,} from '@mui/material';

const localizer = momentLocalizer(moment);

const timeSlotMappingCreator = (timeSlot) => {
  const [start, end] = timeSlot.split('-');

  const parseTime = (time) => {
    const [hour, minute = 0] = time.split(':').map(Number);
    return { hour, minute };
  };

  const { hour: startHour, minute: startMinute } = parseTime(start);
  const { hour: endHour, minute: endMinute } = parseTime(end);

  return {
    startHour,
    startMinute,
    endHour,
    endMinute,
  };
};

const FairCalendarPage = () => {
  const [events, setEvents] = useState([]); 
  const [normalAllFairs, setNormalAllFairs] = useState([]); 
  const [selectedFair, setSelectedFair] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [fairsOfGuide, setFairsOfGuide] = useState([]); 

  // Function to fetch approved tours
  const fetchApprovedFairs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/fairs/list', {
        params: {
          status: 'approved',
        },
      });
      console.log(response)
      const allFairs = response.data.fairs;
      const approvedFairs = allFairs.filter((fair) => (fair.status === 'approved' || fair.status === 'assigned'));
      setNormalAllFairs(approvedFairs);
  
      const events = approvedFairs.map((fair) => {
        const date = moment(fair.date);
        const timeSlot = fair.hour; 
        const slot = timeSlotMappingCreator(timeSlot);
      
        if (!slot) {
          console.warn(`Unknown time slot for fair ${fair._id}: ${timeSlot}`);
          return null;
        }
      
        const start = date.clone().hour(slot.startHour).minute(slot.startMinute).toDate();
        const end = date.clone().hour(slot.endHour).minute(slot.endMinute).toDate();
      
        return {
          _id: fair._id,
          title: fair.schoolName,
          start: start,
          end: end,
          description: fair.notes || '',
          attainedGuide: fair.attainedGuide || '',
        };
      }).filter(event => event !== null);
  
      setEvents(events);


      const guidesFairs = events.filter(
        (fair) => fair.attainedGuide?._id === userId
      );
      console.log("Fairs: ")
      console.log(guidesFairs);
      setFairsOfGuide(guidesFairs); 
    } catch (error) {
      console.error('Error fetching fairs:', error);
    }
  };

 
  const handleSelectEvent = (event) => {
    setSelectedFair(event);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user.id); 
    }
  }, []);

 
  useEffect(() => {
    if (userId) {
      fetchApprovedFairs(); 
    }
  }, [userId]); 

  return (
    <div className="calendar-container">
       <Typography variant="h4" gutterBottom>
            Fair Calendar
        </Typography>
        <Stack direction="row" spacing={2} style={{ marginBottom: 8 }}></Stack>
      <Calendar
        localizer={localizer}
        events={fairsOfGuide} 
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 100px)' }}
        onSelectEvent={handleSelectEvent}
      />
      
      {selectedFair && (
        <div style={{ marginTop: 20 }}>
          <h2>{selectedFair.title}</h2>
          <p>{selectedFair.description}</p>
          <p>
            Start Time: {moment(selectedFair.start).format('MMMM Do YYYY, h:mm A')}
          </p>
          <p>
            End Time: {moment(selectedFair.end).format('MMMM Do YYYY, h:mm A')}
          </p>
        </div>
      )}
    </div>
  );
};

export default FairCalendarPage;
