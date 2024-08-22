import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ParkPage.css';
import { useNavigate } from 'react-router-dom';

function ParkPage() {
  const { parkId } = useParams();
  const [rides, setRides] = useState([]);
  const location = useLocation();
  const parkName = location.state?.parkName || 'Park Rides';

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/parks/${parkId}/rides/current-and-average-wait-times`)
      .then(response => {
        const ridesData = response.data.map(ride => {
          const waitTimeDifference =  ride.average_wait_time - ride.current_wait_time;
          return { ...ride, waitTimeDifference };
        });

        const sortedRides = ridesData.sort((a, b) => b.waitTimeDifference - a.waitTimeDifference);
        setRides(sortedRides);
      })
      .catch(error => {
        console.error('Error fetching ride data:', error);
      });
  }, [parkId]);

  useEffect(() => {
    document.body.style.backgroundImage = 'none';

    const parkBackgrounds = {
      '5': '/backgrounds/MagicKingdom.JPG',
      '6': '/backgrounds/Epcot.JPG',
      '7': '/backgrounds/Hollywood.JPG',
      '8': '/backgrounds/AnimalKingdom.JPG'
    };

    const backgroundImage = parkBackgrounds[parkId] || '/backgrounds/default.JPG';
    document.body.style.backgroundImage = `url(${backgroundImage})`;

    return () => {
      // document.body.style.backgroundImage = 'none';
    };
  }, [parkId]);

  const formatTime = (minutes) => {
    const mins = Math.floor(minutes);
    const seconds = Math.round((minutes - mins) * 60);
    return `${mins}m ${seconds}s`;
  };

  return (
    <div className="container">
      <header className="page-header">
        <div className="back-button" onClick={() => navigate(-1)}>
          ←
        </div>
      </header>
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
              <p>Difference: {formatTime(ride.waitTimeDifference)}</p>
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
