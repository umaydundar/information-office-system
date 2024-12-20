import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../../index.css';
import { Typography, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const localizer = momentLocalizer(moment);

moment.updateLocale('en', {
  week: {
    dow: 1, // Monday as the first day of the week
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

const AllToursCalendarPage = () => {
  const [originalEvents, setOriginalEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [view, setView] = useState('month');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    fetchApprovedTours();
  }, []);

  const fetchApprovedTours = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tours/list', {
        params: {
          status: 'approved',
        },
      });
      const allTours = response.data.tours;

      const approvedTours = allTours.filter(
        (tour) => tour.status === 'approved' || tour.status === 'assigned'
      );

      const rawEvents = approvedTours
        .map((tour) => {
          const date = moment(tour.date);
          const slot = timeSlotMappingCreator(tour.hour);
          if (!slot) {
            console.warn(`Unknown time slot for tour ${tour._id}: ${tour.hour}`);
            return null;
          }

          const start = date.clone().hour(slot.startHour).minute(slot.startMinute).toDate();
          const end = date.clone().hour(slot.endHour).minute(slot.endMinute).toDate();

          return {
            id: tour._id,
            title: tour.schoolName,
            start,
            end,
            description: tour.notes || '',
            city: tour.city || 'N/A',
            numberOfStudents: tour.numberOfStudents || 'N/A',
            guide: tour.attainedGuide || null,
            supervisor: tour.groupSupervisor || null,
            color: tour.attainedGuide ? '#4CAF50' : '#FF9800', // Assigned: greenish, Not Assigned: orange
          };
        })
        .filter((e) => e !== null);

      setOriginalEvents(rawEvents);
      updateEventsForView(view, rawEvents);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const updateEventsForView = (currentView, rawEvents) => {
    if (currentView === 'week') {
      const processedEvents = splitEventsHorizontally(rawEvents);
      setEvents(processedEvents);
    } else {
      setEvents(rawEvents);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedTour(event);
    setIsModalOpen(true);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    updateEventsForView(newView, originalEvents);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTour(null);
  };

  const handleGuideClick = () => {
    if (selectedTour && selectedTour.guide) {
      setSelectedGuide(selectedTour.guide);
      setGuideModalOpen(true);
    }
  };

  const handleGuideModalClose = () => {
    setGuideModalOpen(false);
    setSelectedGuide(null);
  };

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
        All Tours Calendar
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 8 }}></Stack>
      <Calendar
        localizer={localizer}
        events={events}
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
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '1px solid #ffffff',
          },
        })}
        formats={{
          timeGutterFormat: (date, culture, localizer) => {
            const hoursToShow = ['09:00', '11:00', '13:30', '16:00', '18:00'];
            const formattedTime = localizer.format(date, 'HH:mm', culture);
            return hoursToShow.includes(formattedTime) ? formattedTime : '';
          },
        }}
        scrollToTime={new Date(0, 0, 0, 9, 0, 0)}
      />

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{selectedTour?.title || 'Tour Details'}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>City:</strong> {selectedTour?.city || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Number of Students:</strong> {selectedTour?.numberOfStudents || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Supervisor Name:</strong> {selectedTour?.supervisor?.name || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Supervisor Phone:</strong> {selectedTour?.supervisor?.phoneNumber || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {selectedTour?.description || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Start Time:</strong> {moment(selectedTour?.start).format('MMMM Do YYYY, h:mm A')}
          </Typography>
          <Typography variant="body1">
            <strong>End Time:</strong> {moment(selectedTour?.end).format('MMMM Do YYYY, h:mm A')}
          </Typography>

          <Typography variant="body1" style={{ marginTop: '15px' }}>
            <strong>Guide Assigned:</strong>
          </Typography>
          {selectedTour?.guide ? (
            <div 
              style={{
                display: 'inline-block',
                cursor: 'pointer',
                padding: '10px',
                marginTop: '5px',
              }}
              onClick={handleGuideClick}
            >
              {/* Assuming guide has profilePic, name, surname, username */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {selectedTour.guide.profilePic && (
                  <img 
                    src={selectedTour.guide.profilePic} 
                    alt={`${selectedTour.guide.name}`} 
                    style={{ width: '40px', height: '40px', borderRadius:'20px', marginRight:'10px' }}
                  />
                )}
                <div>
                  <Typography variant="body2" style={{fontWeight:'bold'}}>{selectedTour.guide.name} {selectedTour.guide.surname}</Typography>
                  <Typography variant="body2" style={{opacity:0.8}}>@{selectedTour.guide.username}</Typography>
                </div>
              </div>
            </div>
          ) : (
            <Typography variant="body1" style={{ marginTop:'5px' }}>Not Assigned</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Guide Info Modal */}
      <Dialog open={guideModalOpen} onClose={handleGuideModalClose}>
        <DialogTitle>{selectedGuide ? selectedGuide.name + ' ' + selectedGuide.surname : 'Guide Info'}</DialogTitle>
        <DialogContent>
          {selectedGuide && (
            <>
              {selectedGuide.profilePic && (
                <img 
                  src={selectedGuide.profilePic} 
                  alt={selectedGuide.name} 
                  style={{ width: '80px', height: '80px', borderRadius:'40px', marginBottom:'10px' }}
                />
              )}
              <Typography variant="body1"><strong>Name:</strong> {selectedGuide.name}</Typography>
              <Typography variant="body1"><strong>Surname:</strong> {selectedGuide.surname}</Typography>
              <Typography variant="body1"><strong>Username:</strong> {selectedGuide.username}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {selectedGuide.email || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Phone:</strong> {selectedGuide.phone || 'N/A'}</Typography>
              {/* Add more fields if available */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGuideModalClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllToursCalendarPage;
