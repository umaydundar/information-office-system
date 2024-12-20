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

function ForgotPasswordMailPage() {
  const [password, setPassword] = useState('');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const username = queryParams.get('username');
  const email = queryParams.get('emailInput');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("before post");
      console.log(username);
      console.log(password);
      console.log(email);

      const res = await axios.post('http://localhost:5000/auth/forgot_password', {
        username,
        email,
        password,
      });

      alert('Password changed successfully!');
    } catch (error) {
      console.error(error);
      alert('Error changing password.It is likely that you have entered your username wrongly.');
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
          Change Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {/* New Password Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Change Password
          </Button>
        </Box>

        <Grid container sx={{ mt: 2 }}>
          <Grid item xs>
            <Link href="/login" variant="body2">
              Login
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default ForgotPasswordMailPage;
