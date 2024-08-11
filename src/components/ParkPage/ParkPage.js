import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ParkPage.css';

function ParkPage() {
  const { parkId } = useParams();
  const [rides, setRides] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/parks/${parkId}/rides/current-and-average-wait-times`)
      .then(response => {
        setRides(response.data);
      })
      .catch(error => {
        console.error('Error fetching ride data:', error);
      });
  }, [parkId]);

  return (
    <div className="container">
      <h1 className="header">Park Rides</h1>
      <ul className="rideList">
        {rides.map(ride => (
          <li key={ride.ride_id} className="rideItem">
            <Link to={`/ride/${ride.ride_id}`} className="link">
              <h2>{ride.ride_name}</h2>
              <p>Current Wait: {ride.current_wait_time} minutes</p>
              <p>Average Wait: {ride.average_wait_time} minutes</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParkPage;
