import React, { useState} from 'react';
import emailjs from '@emailjs/browser';
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

function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const encodedEmail = encodeURIComponent(email);
      console.log(process.env.REACT_APP_MAIL_SERVICE_ID_THREE);
      emailjs.init(process.env.REACT_APP_MAIL_PUBLIC_ID_THREE);
      emailjs.send(process.env.REACT_APP_MAIL_SERVICE_ID_THREE,process.env.REACT_APP_MAIL_TEMPLATE_ID_CHANGE_PASSWORD,{
            from_name: "Bilkent Staff",
            to_name: username,
            application_link: "http://localhost:3000/forgot-password-mail/?username=" + username + "&emailInput=" + encodedEmail,
            mail_to: email,
      });
      
      alert("You can reset your password through the link sent to your email address.");
    } catch (error) {
      console.error(error);
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
          Forgot Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
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
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            <Link href="Login" variant="body2">
              Login
            </Link>
          </Grid>
        </Grid>
        
      </Box>
    </Container>
  );
}

export default ForgotPasswordPage;