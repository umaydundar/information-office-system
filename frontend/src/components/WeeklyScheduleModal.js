import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

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

const WeeklyScheduleModal = ({ open, onClose, initialSchedule }) => {
  const [schedule, setSchedule] = useState(initialSchedule);

  useEffect(() => {
    if (initialSchedule) {
      setSchedule(initialSchedule);
    }
  }, [initialSchedule]);

  const handleToggle = (dayIndex, hourIndex) => {
    const newSchedule = schedule.map((row, d) =>
      d === dayIndex
        ? row.map((val, h) => (h === hourIndex ? (val === 1 ? 0 : 1) : val))
        : row
    );
    setSchedule(newSchedule);
  };

  const handleSave = () => {
    onClose(schedule);
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)} maxWidth="md" fullWidth>
      <DialogTitle>Edit Weekly Schedule</DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {days.map((day, i) => (
                <TableCell key={i} align="center">
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {hours.map((hour, hourIndex) => (
              <TableRow key={hourIndex}>
                <TableCell>{hour}</TableCell>
                {schedule.map((dayRow, dayIndex) => (
                  <TableCell
                    key={dayIndex}
                    style={{
                      backgroundColor: dayRow[hourIndex] === 1 ? 'green' : 'white',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleToggle(dayIndex, hourIndex)}
                  ></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WeeklyScheduleModal;
