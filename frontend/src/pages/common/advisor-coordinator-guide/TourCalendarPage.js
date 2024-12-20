import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../../index.css';
import { Typography, Stack } from '@mui/material';

const localizer = momentLocalizer(moment);

moment.updateLocale('en', {
  week: {
    dow: 1, // Set Monday as the first day of the week
  },
});

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

const splitEventsHorizontally = (events) => {
  const groups = new Map();
  events.forEach((evt) => {
    const key = evt.start.getTime() + '-' + evt.end.getTime();
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(evt);
  });

  const processed = [];
  for (const [key, groupEvents] of groups.entries()) {
    if (groupEvents.length === 1) {
      processed.push(...groupEvents);
    } else {
      const N = groupEvents.length;
      const duration = groupEvents[0].end.getTime() - groupEvents[0].start.getTime();
      const subDuration = duration / N;
      groupEvents.forEach((evt, index) => {
        const newStart = new Date(evt.start.getTime() + subDuration * index);
        const newEnd = new Date(newStart.getTime() + subDuration);
        processed.push({ ...evt, start: newStart, end: newEnd });
      });
    }
  }

  return processed;
};

const TourCalendarPage = () => {
  const [originalEvents, setOriginalEvents] = useState([]);
  const [toursOfGuide, setToursOfGuide] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState('month');

  const fetchApprovedTours = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tours/list', {
        params: {
          status: ['approved', 'assigned'],
        },
      });
      const allTours = response.data.tours.filter(
        (tour) => tour.status === 'approved' || tour.status === 'assigned'
      );

      const rawEvents = allTours.map((tour) => {
        const date = moment(tour.date);
        const slot = timeSlotMappingCreator(tour.hour);

        if (!slot) {
          console.warn(`Unknown time slot for tour ${tour._id}: ${tour.hour}`);
          return null;
        }

        const start = date.clone().hour(slot.startHour).minute(slot.startMinute).toDate();
        const end = date.clone().hour(slot.endHour).minute(slot.endMinute).toDate();

        return {
          _id: tour._id,
          title: tour.schoolName,
          start,
          end,
          description: tour.notes || '',
          attainedGuide: tour.attainedGuide || '',
        };
      }).filter((e) => e !== null);

      setOriginalEvents(rawEvents);
      updateEventsForGuide(userId, view, rawEvents);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const updateEventsForGuide = (guideId, currentView, rawEvents) => {
    let filteredEvents = rawEvents;

    if (guideId) {
      filteredEvents = rawEvents.filter(
        (event) => event.attainedGuide?._id === guideId
      );
    }

    if (currentView === 'week') {
      filteredEvents = splitEventsHorizontally(filteredEvents);
    }

    setToursOfGuide(filteredEvents);
  };

  const handleSelectEvent = (event) => {
    setSelectedTour(event);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    updateEventsForGuide(userId, newView, originalEvents);
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
      fetchApprovedTours();
    }
  }, [userId]);

  return (
    <div
      className="calendar-container"
      style={{
        width: '100%',
        marginLeft: '0px',
        marginRight: '0px',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Tour Calendar
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 8 }}></Stack>
      <Calendar
        localizer={localizer}
        events={toursOfGuide}
        view={view}
        onView={handleViewChange}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: 'calc(150vh - 150px)',
          maxWidth: '100%',
        }}
        min={new Date(0, 0, 0, 9, 0, 0)}
        max={new Date(0, 0, 0, 18, 0, 0)}
        step={30}
        timeslots={1}
        onSelectEvent={handleSelectEvent}
        formats={{
          timeGutterFormat: (date, culture, localizer) => {
            const hoursToShow = ['09:00', '11:00', '13:30', '16:00', '18:00'];
            const formattedTime = localizer.format(date, 'HH:mm', culture);
            return hoursToShow.includes(formattedTime) ? formattedTime : '';
          },
        }}
        scrollToTime={new Date(0, 0, 0, 9, 0, 0)}
      />
      {selectedTour && (
        <div style={{ marginTop: 20 }}>
          <h2>{selectedTour.title}</h2>
          <p>{selectedTour.description}</p>
          <p>
            Start Time: {moment(selectedTour.start).format('MMMM Do YYYY, h:mm A')}
          </p>
          <p>
            End Time: {moment(selectedTour.end).format('MMMM Do YYYY, h:mm A')}
          </p>
        </div>
      )}
    </div>
  );
};

export default TourCalendarPage;
