import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ParkPage.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function ParkPage() {
  const { parkId } = useParams();
  const [rides, setRides] = useState([]);
  const location = useLocation();
  const parkName = location.state?.parkName || 'Park Rides'; // Retrieve parkName from state

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/parks/${parkId}/rides/current-and-average-wait-times`)
      .then(response => {
        const ridesData = response.data.map(ride => {
          // Calculate the difference between current wait time and average wait time
          const waitTimeDifference = ride.current_wait_time - ride.average_wait_time;
          return { ...ride, waitTimeDifference }; // Add the difference as a new property
        });

        // Sort rides by the difference, largest to smallest
        const sortedRides = ridesData.sort((a, b) => b.waitTimeDifference - a.waitTimeDifference);

        setRides(sortedRides); // Update the state with sorted rides
        console.log(sortedRides);
      })
      .catch(error => {
        console.error('Error fetching ride data:', error);
      });
  }, [parkId]);

  // Helper function to convert minutes to minutes and seconds
  const formatTime = (minutes) => {
    const mins = Math.floor(minutes);
    const seconds = Math.round((minutes - mins) * 60);
    return `${mins}m ${seconds}s`;
  };

  // Helper function to convert 24-hour time to 12-hour AM/PM format
  const formatInterval = (interval) => {
    const [hour, minute] = interval.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format, treating 0 as 12
    return `${formattedHour}:${minute < 10 ? `0${minute}` : minute} ${period}`;
  };

  return (
    <div className="container">
      {/* Back Button */}
      <div className="back-button" onClick={() => navigate(-1)}>
        ← {/* Simple arrow */}
      </div>
      <h1 className="header">{parkName}</h1>
      <ul className="rideList">
        {rides.map(ride => (
          <li key={ride.ride_id} className="rideItem">
            <Link 
              to={`/ride/${ride.ride_id}`} 
              state={{ rideName: ride.ride_name }} 
              className="link"
            >              
              <h2>{ride.ride_name}</h2>
              <p>Current Wait: {formatTime(ride.current_wait_time)}</p>
              <p>Average Wait: {formatTime(ride.average_wait_time)}</p>
              <p>Difference: {formatTime(ride.waitTimeDifference)}</p> {/* Display the difference */}
            </Link>
          </li>
        ))}
      </ul>
      <footer className="footer">
        <p>Powered by <a href="https://queue-times.com/en-US/pages/api" target="_blank" rel="noopener noreferrer">Queue Times</a></p>
      </footer>
    </div>
  );
}

export default ParkPage;
