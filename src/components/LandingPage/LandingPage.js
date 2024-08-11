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
  

  return (
    <div className="container">
      <h1 className="header">Disney Park Average Wait Times</h1>
      <ul className="parkList">
        {parks.map(park => (
          <li key={park.park_id} className="parkItem">
            <Link to={`/park/${park.park_id}`} className="link">
              <h2>{park.park_name}</h2>
              <p>Average Wait Time: {park.average_wait_time} minutes</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LandingPage;
