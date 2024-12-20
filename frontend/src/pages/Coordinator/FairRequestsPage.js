import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from '@emailjs/browser';
import '../../index.css';
import {Table, TableBody, TableHead, TableRow, TableCell} from '@mui/material';

function FairRequestsPage() {
  const [fairRequests, setFairRequests] = useState([]);
  const [pendingFairRequests, setPendingFairRequests] = useState([]);

  useEffect(() => {
    const fetchFairs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/fairs/list");
        setFairRequests(response.data.fairs);
      } catch (error) {
        console.error("Error fetching fairs:", error);
      }
    };
    fetchFairs();
  }, []);

  useEffect(() => {
    const pendingFairs = fairRequests.filter(
      (fair) => fair.status === "pending"
    );
    setPendingFairRequests(pendingFairs);
  }, [fairRequests]);

  const handleApprove = async (fairId) => {
    const fair = fairRequests.find((t) => t._id === fairId);
    if (!fair) {
      console.error("Fair not found!");
      return;
    }
    const { hour: currentHour } = fair; // Extract the hour from the found fair
  
    // Helper function to calculate end time
  
    // Calculate the new hour
    try {
      const response = await axios.put(`http://localhost:5000/fairs/update/${fairId}`, {
        status: "approved",
      })
      const fairRequest = fairRequests.find((fair) => fair._id === fairId);
      console.log(fairRequests)
      emailjs.init(process.env.REACT_APP_MAIL_PUBLIC_ID_FOUR);
            emailjs.send(process.env.REACT_APP_MAIL_SERVICE_ID_FOUR, process.env.REACT_APP_MAIL_TEMPLATE_ID_FAIR_RESULT, {
              from_name: "Bilkent Staff",
              to_name: "Sayın okul görevlisi",
              mail_to: fairRequest.email,
              result: "kabul edilmiştir",
            });
      setFairRequests((prev) =>
        prev.map((fair) =>
          fair._id === fairId ? { ...fair, status: "approved" } : fair
        )
      );
    } catch (error) {
      console.error("Error approving fair:", error);
    }
  };

  const handleReject = async (fairId) => {
    try {
      const response = await axios.put(`http://localhost:5000/fairs/update/${fairId}`, {
        status: 'rejected',
      })
      console.log(fairRequests)
      const fairRequest = fairRequests.find((fair) => fair._id === fairId);
      console.log(fairRequest);
      emailjs.init(process.env.REACT_APP_MAIL_PUBLIC_ID_FOUR);
            emailjs.send(process.env.REACT_APP_MAIL_SERVICE_ID_FOUR, process.env.REACT_APP_MAIL_TEMPLATE_ID_FAIR_RESULT, {
              from_name: "Bilkent Staff",
              to_name: "Sayın okul görevlisi",
              mail_to: fairRequest.email,
              result: "maalesef kabul edilmemiştir",
            });
      setFairRequests((prev) =>
        prev.map((fair) =>
          fair._id === fairId ? { ...fair, status: "rejected" } : fair
        )
      );
      
    } catch (error) {
      console.error("Error rejecting fair:", error);
    }
  };

  return (
    <div className="fair-requests-container">
      <h2>Pending Fair Requests</h2>
      {pendingFairRequests.length > 0 ? (
        <Table className="styled-table">
          <TableHead>
            <TableRow>
              <TableCell>HIGH SCHOOL</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>HOUR</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingFairRequests.map((fair) => (
              <TableRow key={fair._id}>
                <TableCell>{fair.schoolName}</TableCell>
                <TableCell>{new Date(fair.date).toLocaleDateString()}</TableCell>
                <TableCell>{fair.hour}</TableCell>
                <TableCell>
                  <button
                    className="action-button approve"
                    onClick={() => handleApprove(fair._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="action-button reject"
                    onClick={() => handleReject(fair._id)}
                  >
                    Reject
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No pending fairs at the moment.</p>
      )}
    </div>
  );
}

export default FairRequestsPage;
