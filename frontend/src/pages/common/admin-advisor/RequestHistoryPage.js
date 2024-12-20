import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs'
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {
  Paper,
  Stack,
  Typography,
} from '@mui/material';

function RequestHistoryPage() {

  const [tourRequests, setTourRequests] = useState([]);


  const moment = require('moment');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tours/list');
        const allTourRequests = response.data.tours;
        setTourRequests(allTourRequests);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours();
  }, []);

  const columns = [
    { field: 'schoolName', headerName: 'High School', flex: 1 },
    { 
      field: 'date', 
      headerName: 'Date', 
      flex: 1,
      valueFormatter: (params) => {
        // Using moment to format the date
        const formattedDate = moment(params).format('DD/MM/YYYY');
        return formattedDate;
      }, // Format the date
    },
    { field: 'status', headerName: 'Approval Status', flex: 1 },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Tour Request History
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}></Stack>
      <Paper elevation={3} sx={{ height: 500, width: '100%', marginBottom: 2 }}>
        <DataGrid
          rows={tourRequests.map((tour) => ({ ...tour, id: tour._id }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </Paper>
      </div>
  );
}

export default RequestHistoryPage;
