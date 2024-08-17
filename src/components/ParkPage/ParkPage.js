import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ParkPage.css';

function ParkPage() {
  const { parkId } = useParams();
  const [rides, setRides] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/parks/${parkId}/rides/current-and-average-wait-times`)
      .then(response => {
        setRides(response.data);
        console.log(response.data)
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
      <h1 className="header">Park Rides</h1>
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParkPage;
