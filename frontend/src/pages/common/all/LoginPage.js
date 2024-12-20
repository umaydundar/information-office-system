import React, { useState, useContext } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext'; // Import AuthContext

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Access login function from AuthContext
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    navigate('/forgot-password'); 
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        username,
        password,
      });

      // Save token and user type via login function
      login(res.data.token, res.data.userType);

      // Redirect based on user type
      if (res.data.userType === 'guide') {
        navigate('/guide');
      } else if (res.data.userType === 'advisor') {
        navigate('/advisor');
      } else if (res.data.userType === 'coordinator') {
        navigate('/coordinator');
      } else if (res.data.userType === 'admin') {
        navigate('/admin');
      }
    } catch (error) {
      console.error(error);
      alert('Invalid credentials');
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
        <Typography component="h1" variant="h4" sx={{ marginBottom: 2 }}>
          Welcome to Bilkent Information Office
        </Typography>

        <Typography component="h2" variant="h6" sx={{ marginBottom: 2 }}>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="ID or Email"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
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
            Login
          </Button>
        </Box>

        <Grid container sx={{ mt: 2 }}>
          <Grid item xs>
            <Link onClick={handleForgotPassword} variant="body2">
              Forgot Password?
            </Link>
          </Grid>
        </Grid>

      </Box>
    </Container>
  );
}

export default LoginPage;