import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../index.css';
import emailjs from '@emailjs/browser';
import moment from 'moment';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, TableCell, Table, TableBody, TableHead, TableRow, Paper } from '@mui/material';
import { Visibility, VisibilityOff, Refresh as RefreshIcon } from '@mui/icons-material'; // If needed for password gen removed previously
import './TourRequestsPage.css';

function TourRequestsPage() {
  const [tourRequests, setTourRequests] = useState([]);
  const [pendingTourRequests, setPendingTourRequests] = useState([]);
  const [calendarData, setCalendarData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment());

  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoursForDay, setHoursForDay] = useState([]);
  const [currentHourIndex, setCurrentHourIndex] = useState(0);

  const timeslotsToCheck = ['09:00', '11:00', '13:30', '16:00'];

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tours/list");
        setTourRequests(response.data.tours);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    const pendingTours = tourRequests.filter((tour) => tour.status === "pending");
    setPendingTourRequests(pendingTours);
    generateCalendarData(tourRequests);
  }, [tourRequests]);

  const handleApprove = async (tourId) => {
    const tour = tourRequests.find((t) => t._id === tourId);
    if (!tour) {
      console.error("Tour not found!");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/tours/update/${tourId}`, {
        status: "approved"
      });
      const formattedDate = moment(tour.date).format('YYYY-MM-DD');
      try{
        emailjs.init(process.env.REACT_APP_MAIL_PUBLIC_ID_TWO);
        emailjs.send(process.env.REACT_APP_MAIL_SERVICE_ID_TWO,process.env.REACT_APP_MAIL_TEMPLATE_ID_ACCEPTED,{
          from_name: "Bilkent Staff",
          to_name: "görevli",
          message: "",
          mail_to: tour.email,
          tour_date: formattedDate,
          cancel_page: "http://localhost:3000/cancel-tour-request-page/?tourID=" + tour._id,
          tour_hour: tour.hour,
        });
      } catch (error) {
        console.error("Error sending acceptance email:", error);
      }
      setTourRequests((prev) =>
        prev.map((t) =>
          t._id === tourId ? { ...t, status: "approved"} : t
        )
      );
    } catch (error) {
      console.error("Error approving tour:", error);
    }
  };

  const handleReject = async (tourId) => {
    const rejectedTour = tourRequests.find((t) => t._id === tourId);
    try {
      await axios.put(`http://localhost:5000/tours/update/${tourId}`, {
        status: 'rejected',
      });
      setTourRequests((prev) =>
        prev.map((tour) =>
          tour._id === tourId ? { ...tour, status: "rejected" } : tour
        )
      );
      try {
        const tourDate = moment(rejectedTour.date).format('YYYY-MM-DD');
        emailjs.init(process.env.REACT_APP_MAIL_PUBLIC_ID_ONE);
        emailjs.send(process.env.REACT_APP_MAIL_SERVICE_ID_ONE,process.env.REACT_APP_MAIL_TEMPLATE_ID_REJECTED,{
          from_name: "Bilkent Staff",
          to_name: "görevli",
          message: "",
          mail_to: rejectedTour.email,
          application_link: "http://localhost:3000/request-tour",
          tour_date: tourDate,
          tour_hour: rejectedTour.hour,
        });
      }
      catch (error) {
        console.error("Error sending rejection email:", error);
      }
    } catch (error) {
      console.error("Error rejecting tour:", error);
    }
  };

  const generateCalendarData = (tours) => {
    const data = {};
    tours.forEach((tour) => {
      if (tour.status === 'rejected') return;

      const dateStr = moment(tour.date).format('YYYY-MM-DD');
      const hour = tour.hour; // We show exact hour range like '09:00-11:00'
      if (!data[dateStr]) data[dateStr] = {};
      if (!data[dateStr][hour]) data[dateStr][hour] = [];
      
      data[dateStr][hour].push(tour);
    });
    setCalendarData(data);
  };

  const startOfMonth = currentMonth.clone().startOf('month').startOf('isoWeek');
  const endOfMonth = currentMonth.clone().endOf('month').endOf('isoWeek');

  const calendarDays = [];
  let day = startOfMonth.clone();
  while (day.isBefore(endOfMonth, 'day')) {
    calendarDays.push(day.clone());
    day.add(1, 'day');
  }

  const weeks = [];
  for (let i=0; i<calendarDays.length; i+=7) {
    weeks.push(calendarDays.slice(i,i+7));
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev.clone().add(1, 'month'));
  };

  const handleDayClick = (dayMoment) => {
    const dateStr = dayMoment.format('YYYY-MM-DD');
    const dayData = calendarData[dateStr] || {};

    // Get only hours that actually have tours
    const hours = Object.keys(dayData).sort((a,b)=>{
      // sort by start time
      const aStart = a.split('-')[0];
      const bStart = b.split('-')[0];
      return moment(aStart, 'HH:mm') - moment(bStart, 'HH:mm');
    });

    if (hours.length === 0) {
      return; // no tours that day
    }

    setSelectedDay({ dateStr, hours, dayData });
    setCurrentHourIndex(0);
    setDayModalOpen(true);
  };

  const handleHourNavigation = (direction) => {
    if (!selectedDay) return;
    let newIndex = currentHourIndex;
    if (direction === 'prev' && currentHourIndex > 0) {
      newIndex = currentHourIndex - 1;
    } else if (direction === 'next' && currentHourIndex < selectedDay.hours.length - 1) {
      newIndex = currentHourIndex + 1;
    }
    setCurrentHourIndex(newIndex);
  };

  const handleHourTourAction = async (tourId, action) => {
    if (action === 'approve') {
      await handleApprove(tourId);
    } else if (action === 'reject') {
      await handleReject(tourId);
    }
    // Refresh the data after action
    const res = await axios.get("http://localhost:5000/tours/list");
    setTourRequests(res.data.tours);

    // Update selectedDay data after refresh
    const dayData = calendarData[selectedDay.dateStr] || {};

    // Update local state for instant feedback
    const updatedTours = currentHourTours.map((t) =>
      t._id === tourId ? { ...t, status: action === 'approve' ? 'approved' : 'rejected' } : t
    );
    setSelectedDay((prev) => {
      if (!prev) return prev;

      const updatedDayData = { ...prev.dayData };
      updatedDayData[selectedDay.hours[currentHourIndex]] = updatedTours;

      return { ...prev, dayData: updatedDayData };
    });
    };

  const renderDayCell = (dayMoment) => {
    const dateStr = dayMoment.format('YYYY-MM-DD');
    const isCurrentMonthDisplayed = dayMoment.month() === currentMonth.month();
    const dayData = calendarData[dateStr] || {};
    const hours = Object.keys(dayData).sort((a, b) => {
        const aStart = a.split('-')[0];
        const bStart = b.split('-')[0];
        return moment(aStart, 'HH:mm') - moment(bStart, 'HH:mm');
    });

    return (
        <div
            className={`day-cell ${isCurrentMonthDisplayed ? '' : 'other-month'}`}
            onClick={() => handleDayClick(dayMoment)}
        >
            <div className="day-number">{dayMoment.date()}</div>
            {hours.map((hourRange) => {
                const tours = dayData[hourRange];
                return (
                    <div key={hourRange}>
                        <div className="hour-label">{hourRange.split('-')[0]}</div>
                        {tours.map((t) => {
                            const boxColor = t.status === 'pending' ? 'red-box' : 'gray-box';
                            return (
                                <div
                                    key={t._id}
                                    className={`tour-box ${boxColor}`}
                                    style={{
                                        padding: '5px',
                                        margin: '5px 0',
                                        borderRadius: '5px',
                                    }}
                                >
                                    {t.schoolName} ({t.numberOfStudents})
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};


  const currentHourTours = selectedDay ? selectedDay.dayData[selectedDay.hours[currentHourIndex]] : [];

  return (
    <div className="tour-requests-container">
      <Typography variant="h4" gutterBottom>
        Tour Requests
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}></Stack>

      <div className="month-navigation">
        <IconButton onClick={handlePreviousMonth} className="month-nav-arrow">
          <span>&#9664;</span> {/* Left arrow */}
        </IconButton>
        <h2 className="month-title">{currentMonth.format('MMMM YYYY')}</h2>
        <IconButton onClick={handleNextMonth} className="month-nav-arrow">
          <span>&#9654;</span> {/* Right arrow */}
        </IconButton>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-header-cell">Mon</div>
          <div className="calendar-header-cell">Tue</div>
          <div className="calendar-header-cell">Wed</div>
          <div className="calendar-header-cell">Thu</div>
          <div className="calendar-header-cell">Fri</div>
          <div className="calendar-header-cell">Sat</div>
          <div className="calendar-header-cell">Sun</div>
        </div>
        <div className="calendar-body">
          {weeks.map((week,i) => (
            <div key={i} className="calendar-week">
              {week.map((dayMoment, j) => (
                <div key={j} className="calendar-day">
                  {renderDayCell(dayMoment)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <h2 className="section-title">Pending Tour Requests</h2>
      {pendingTourRequests.length > 0 ? (
      <Paper>
         <Table className="styled-table">
          <TableHead>
            <TableRow>
              <TableCell>HIGH SCHOOL</TableCell>
              <TableCell>CITY</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>HOUR</TableCell>
              <TableCell>STUDENTS</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingTourRequests.map((tour) => (
              <TableRow key={tour._id}>
                <TableCell>{tour.schoolName}</TableCell>
                <TableCell>{tour.city}</TableCell>
                <TableCell>{new Date(tour.date).toLocaleDateString()}</TableCell>
                <TableCell>{tour.hour}</TableCell>
                <TableCell>{tour.numberOfStudents}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    style={{ marginRight:'5px' }}
                    onClick={() => handleApprove(tour._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(tour._id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
       
      ) : (
        <p>No pending tours at the moment.</p>
      )}

      {/* Day Modal for comparing hours */}
      <Dialog open={dayModalOpen} onClose={() => setDayModalOpen(false)} maxWidth="lg"    PaperProps={{
    style: {
      padding: '20px', // Adds some space around the content
      minHeight: '70vh', // Increases vertical space
    },
  }}>
        {selectedDay && (
          <>
            <DialogTitle>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
            <IconButton
                  onClick={() => handleHourNavigation('prev')}
                  disabled={currentHourIndex === 0}
                >
                  {currentHourIndex === 0 ? <span style={{color:'gray'}}>&#9664;</span> : <span>&#9664;</span>}
                </IconButton>
                <Typography variant="h6">
                  {selectedDay.hours[currentHourIndex]}
                </Typography>
                <IconButton
                  onClick={() => handleHourNavigation('next')}
                  disabled={currentHourIndex === selectedDay.hours.length - 1}
                >
                  {currentHourIndex === selectedDay.hours.length - 1 ? <span style={{color:'gray'}}>&#9654;</span> : <span>&#9654;</span>}
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <tbody>
      <tr>
        <th style={{ textAlign: 'left', padding: '5px' }}>School</th>
        {currentHourTours.map((t) => (
          <td key={t._id} style={{ padding: '5px', verticalAlign: 'top' }}>
            {t.schoolName}
          </td>
        ))}
      </tr>
      <tr>
        <th style={{ textAlign: 'left', padding: '5px' }}>City</th>
        {currentHourTours.map((t) => (
          <td key={t._id} style={{ padding: '5px' }}>
            {t.city}
          </td>
        ))}
      </tr>
      <tr>
        <th style={{ textAlign: 'left', padding: '5px' }}>Number of Students</th>
        {currentHourTours.map((t) => (
          <td key={t._id} style={{ padding: '5px' }}>
            {t.numberOfStudents}
          </td>
        ))}
      </tr>
      <tr>
        <th style={{ textAlign: 'left', padding: '5px' }}>Group Supervisor Name</th>
        {currentHourTours.map((t) => (
          <td key={t._id} style={{ padding: '5px' }}>
            {t.groupSupervisor?.name || ''}
          </td>
        ))}
      </tr>
      <tr>
        <th style={{ textAlign: 'left', padding: '5px' }}>Group Supervisor Phone</th>
        {currentHourTours.map((t) => (
          <td key={t._id} style={{ padding: '5px' }}>
            {t.groupSupervisor?.phoneNumber || ''}
          </td>
        ))}
      </tr>
      <tr>
        <th style={{ textAlign: 'left', padding: '5px' }}>Notes</th>
        {currentHourTours.map((t) => (
          <td key={t._id} style={{ padding: '5px' }}>
            {t.notes || ''}
          </td>
        ))}
      </tr>
      <tr>
        <th style={{ textAlign: 'left', padding: '5px' }}>Action</th>
        {currentHourTours.map((t) => {
          const isPending = t.status === 'pending';
          const isAccepted = (t.status === 'approved' || t.status === 'assigned');
          const isRejected = (t.status === 'rejected' || t.status === 'rejected');

          return (
            <td key={t._id} style={{ padding: '5px' }}>
              {isAccepted && <span>Accepted</span>}
              {isRejected && <span>Rejected</span>}

              {isPending && (
                <div style={{marginTop:'10px'}}>
                  <Button
                    variant="contained"
                    color="success"
                    style={{ marginRight:'5px' }}
                    onClick={() => handleHourTourAction(t._id, 'approve')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleHourTourAction(t._id, 'reject')}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </td>
          );
        })}
      </tr>
    </tbody>
  </table>
</DialogContent>


            <DialogActions>
              <Button onClick={() => setDayModalOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default TourRequestsPage;
