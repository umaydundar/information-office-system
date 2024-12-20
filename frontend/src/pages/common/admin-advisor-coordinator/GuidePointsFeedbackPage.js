import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../../../index.css';
import {
  Button,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import axios from 'axios';

function GuidePointsFeedbackPage() {
  const [tours, setTours] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null); // Selected guide object
  const [showPopup, setShowPopup] = useState(false);

  // Fetch guides and attach feedbacks
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        const guides = response.data.users.filter(
          (user) => user.userType === "advisor" || user.userType === "guide"
        );

        const guidesWithFeedbacks = guides.map((guide) => {
          const relevantTours = tours.filter(
            (tour) => tour.attainedGuide._id === guide._id && tour.toursFeedback
          );

          const feedbacks = relevantTours.map((tour) => tour.toursFeedback);
          return { ...guide, feedbacks }; // Add feedbacks to each guide
        });
        console.log(guidesWithFeedbacks)

        setGuides(guidesWithFeedbacks);
      } catch (error) {
        console.error('Error fetching guides:', error);
      }
    };

    fetchGuides();
  }, [tours]); // Re-fetch guides when tours change

  // Fetch tours data
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tours/list');
        const allTourRequests = response.data.tours;
        const approvedTours = allTourRequests.filter(
          (tour) => tour.status === "completed"
        );
        setTours(approvedTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours();
  }, []);

  // Handle feedback button click
  const handleButtonClick = (guideId) => {
    const guideToSelect = guides.find((guide) => guide._id === guideId);
    setSelectedGuide(guideToSelect); // Set the selected guide
    setShowPopup(true); // Show popup
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const columns = [
    { field: 'username', headerName: 'Guide Name', flex: 1 },
    { field: 'score', headerName: 'Average Score', flex: 1 },
    {
      field: 'feedbacks',
      headerName: 'Feedbacks',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleButtonClick(params.row._id)}
          >
            View Feedbacks
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        Guide Points & Feedback
      </Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}></Stack>
      <Paper elevation={3} sx={{ height: 500, width: '100%', marginBottom: 2 }}>
        <DataGrid
          rows={guides.map((guide) => ({ ...guide, id: guide._id }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row._id}
        />
      </Paper>

      {showPopup && selectedGuide && (
      <div className="gp-feedback-popup-overlay">
        <div className="gp-feedback-popup-content">
          <h3 className="gp-feedback-popup-title">
            Feedbacks for {selectedGuide.username}
          </h3>
          <div className="gp-feedback-popup-feedbacks-container">
            {selectedGuide.feedbacks.length > 0 ? (
              selectedGuide.feedbacks.map((feedback, index) => (
                <div key={index} className="gp-feedback-popup-feedback-item">
                  <Typography
                    variant="body1"
                    className="gp-feedback-popup-feedback-text"
                  >
                    {feedback}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography
                variant="body1"
                className="gp-feedback-popup-no-feedback-text"
              >
                No feedbacks available for this guide.
              </Typography>
            )}
          </div>
          <div className="gp-feedback-popup-button-container">
            <Button
              variant="contained"
              color="primary"
              onClick={closePopup}
              className="gp-feedback-popup-close-button"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

export default GuidePointsFeedbackPage;