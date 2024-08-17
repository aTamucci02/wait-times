import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const [parks, setParks] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/parks/average-wait-times`)
      .then(response => {
        console.log('API Response:', response.data); // Log the data to the console
        setParks(response.data);
      })
      .catch(error => {
        console.error('Error fetching park data:', error);
      });
  }, []);

  // Helper function to convert minutes to minutes and seconds
  const formatTime = (minutes) => {
    const mins = Math.floor(minutes);
    const seconds = Math.round((minutes - mins) * 60);
    return `${mins}m ${seconds}s`;
  };

  return (
    <div className="container">
      <h1 className="header">Disney Park Average Wait Times</h1>
      <ul className="parkList">
        {parks.map(park => (
          <li key={park.park_id} className="parkItem">
            <Link 
              to={`/park/${park.park_id}`} 
              state={{ parkName: park.park_name }} // Pass parkName through state
              className="link"
            >
              <h2 style={{color: 'black'}}>{park.park_name}</h2>
              <p>Average Wait Time: {formatTime(park.average_wait_time)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LandingPage;
