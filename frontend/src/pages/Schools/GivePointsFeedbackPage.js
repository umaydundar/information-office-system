import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";

const FeedbackPage = () => {
  // State to store rating and feedback
  const [rating, setRating] = useState(5); // Default rating is 5
  const [feedback, setFeedback] = useState('');
  const [guides, setGuides] = useState([]);
  const [completedTours, setCompletedTours] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tourID = queryParams.get("tourID");

  // Fetch guides and completed tours together
  useEffect(() => {
    const fetchGuidesAndTours = async () => {
      try {
        // Fetch guides
        const guidesResponse = await axios.get('http://localhost:5000/admin/users', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        const guidesData = guidesResponse.data.users.filter(
          (user) => user.userType === "advisor" || user.userType === "guide"
        );
        setGuides(guidesData);

        // Fetch tours
        const toursResponse = await axios.get('http://localhost:5000/tours/list');
        const toursData = toursResponse.data.tours.filter(
          (tour) => tour.status === "completed"
        );
        setCompletedTours(toursData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGuidesAndTours();
  }, []);

  // Update guide points once guides and tours are available
  useEffect(() => {
    const setGuidePoints = async () => {
      if (guides.length === 0 || completedTours.length === 0) return;

      try {
        for (const guide of guides) {
          const guideId = guide._id;
          let totalPoints = 0;
          let numOfMatchingTours = 0;

          completedTours.forEach((tour) => {
            if (tour.attainedGuide && tour.attainedGuide._id === guideId && tour.tourPoint) {
              numOfMatchingTours++;
              totalPoints += tour.tourPoint;
            }
          });

          if (numOfMatchingTours > 0) {
            await axios.put(`http://localhost:5000/admin/update-user/${guideId}`, {
              score: totalPoints / numOfMatchingTours,
            });
          }
        }
      } catch (error) {
        console.error('Error updating guide points:', error);
      }
    };

    setGuidePoints();
  }, [guides, completedTours]);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (rating < 1 || rating > 10) {
      alert('Rating must be between 1 and 10.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/tours/update/${tourID}`, {
        tourPoint: rating,
        toursFeedback: feedback,
      });

      if (response.status === 200) {
        alert("Thank you for your feedback!");
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
    setSubmitted(true);
  };

  const handleWheelScroll = (event) => {
    if (event.deltaY > 0 && rating < 10) {
      setRating((prevRating) => Math.min(prevRating + 1, 10));
    } else if (event.deltaY < 0 && rating > 1) {
      setRating((prevRating) => Math.max(prevRating - 1, 1));
    }
  };

  return (
    <div className="feedback-page-container">
      <h1 className="feedback-page-title">Feedback Form</h1>
      {!submitted ? (
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="feedback-form-group" onWheel={handleWheelScroll}>
            <label htmlFor="feedback-rating" className="feedback-form-label">Rating (1-10):</label>
            <input
              type="range"
              id="feedback-rating"
              name="rating"
              value={rating}
              onChange={handleRatingChange}
              min="1"
              max="10"
              step="1"
              className="feedback-form-slider"
              required
            />
            <div className="slider-value">{rating}</div>
          </div>
          <div className="feedback-form-group">
            <label htmlFor="feedback-text" className="feedback-form-label">Your Feedback:</label>
            <textarea
              id="feedback-text"
              name="feedback"
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Write your feedback here"
              rows="5"
              className="feedback-form-textarea"
              required
            ></textarea>
          </div>
          <button type="submit" className="feedback-form-submit-btn">Submit Feedback</button>
        </form>
      ) : (
        <div className="feedback-submission-confirmation">
          <h2 className="feedback-submission-title">Thank you for your feedback!</h2>
          <p><strong>Rating:</strong> {rating}</p>
          <p><strong>Feedback:</strong> {feedback}</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
