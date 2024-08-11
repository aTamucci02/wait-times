import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RideDetailsPage.css';

function RideDetailsPage() {
  const { rideId } = useParams();
  const [waitTimes, setWaitTimes] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/rides/${rideId}/average-wait-times/interval`)
      .then(response => {
        setWaitTimes(response.data);
      })
      .catch(error => {
        console.error('Error fetching wait times:', error);
      });
  }, [rideId]);

  return (
    <div className="container">
      <h1 className="header">Ride Wait Times</h1>
      <ul className="timeList">
        {waitTimes.map((time, index) => (
          <li key={index} className="timeItem">
            {time.interval}: {time.average_wait_time} minutes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RideDetailsPage;
