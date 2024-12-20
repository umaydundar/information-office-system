import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Link,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function CancelTourRequestPage() {
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const tourID = queryParams.get('tourID');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(tourID);
      const response = await axios.put(`http://localhost:5000/tours/update/${tourID}`, {
        status: 'canceled',
      });

      alert('Tur talebiniz iptal edilmiştir. Dilerseniz başka bir tarihte tekrar başvurabilirsiniz.');
    } catch (error) {
      console.error(error);
      alert('Hata oluştu!');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography component="h2" variant="h6" sx={{ marginBottom: 2 }}>
          Tur İptal Sayfası
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Turu İptal Et
          </Button>
        </Box>

        <Grid container sx={{ mt: 2 }}>
          <Grid item xs>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default CancelTourRequestPage;
