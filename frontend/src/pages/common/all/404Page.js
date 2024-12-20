import React from 'react';
import { useNavigate } from 'react-router-dom';
import notFoundImage from '../../../404_image.jpg';
import { Box } from '@mui/material';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/'); // Replace '/' with the path to your initial page if different
  };

  return (
    <div style={styles.container}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "50%",
          maxHeight: "auto",
        }}>
        <img src={notFoundImage} alt="404 Not Found" style={styles.image} />
        <button style={styles.button} onClick={goToHome}>
          Go to Home
        </button>
      </Box>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: '20px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default NotFoundPage;
