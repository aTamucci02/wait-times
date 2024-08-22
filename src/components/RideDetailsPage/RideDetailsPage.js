import React, { useEffect, useState } from 'react';
import { useParams, useLocation  } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './RideDetailsPage.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function RideDetailsPage() {
  const { rideId } = useParams();
  const location = useLocation(); // Access location object
  const rideName = location.state?.rideName || 'Ride Details'; // Retrieve rideName from state

  const navigate = useNavigate(); // Initialize useNavigate


  const [chartData, setChartData] = useState([]);
  const [fullData, setFullData] = useState([]); // Store all 5-minute intervals
  const [expandedHour, setExpandedHour] = useState(null); // Track which hour is expanded
  const [maxWaitTime, setMaxWaitTime] = useState(100); // Default max

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/rides/${rideId}/average-wait-times/interval`)
      .then(response => {
        const data = response.data;
        console.log(data);

        // Calculate the max wait time from the data
        const maxWait = Math.max(...data.map(item => parseFloat(item.average_wait_time)));
        console.log(maxWait)
        const minWait = Math.min(...data.map(item => parseFloat(item.average_wait_time)));
  
        // Create chart data with necessary formatting
        const { plots, fullPlots } = createPlots(data);
        setChartData(plots);  // Data for the chart and hourly list
        setFullData(fullPlots); // Data for all 5-minute intervals
        setMaxWaitTime(Math.round(parseFloat(maxWait) / 10) * 10);
        console.log(maxWaitTime)
      })
      .catch(error => {
        console.error('Error fetching wait times:', error);
      });
  }, [rideId]);

  // Helper function to convert minutes to minutes and seconds
  const formatTime = (minutes) => {
    const mins = Math.floor(minutes);
    const seconds = Math.round((minutes - mins) * 60);
    return `${mins}m ${seconds}s`;
  };

  // Simplified formatInterval function since times are already in Eastern Time
  const formatInterval = (interval) => {
    let [hour, minute] = interval.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format, treating 0 as 12
    return `${formattedHour}:${minute < 10 ? `0${minute}` : minute} ${period}`;
  };

  // Helper function to create the plots array
  const createPlots = (waitTimes) => {
    const plots = [];
    const fullPlots = [];
    const startHour = 8;

    for (let index = 0; index < waitTimes.length; index++) {
      const adjustedInterval = adjustInterval(index, startHour);
      const formattedInterval = formatInterval(adjustedInterval);

      const waitTime = parseFloat(parseFloat(waitTimes[index].average_wait_time).toFixed(2));

      // Push all intervals into fullPlots
      fullPlots.push({
        time: adjustedInterval,
        displayTime: formattedInterval,
        averageWait: waitTime,
      });

      // Only push the top of the hour to plots
      if (adjustedInterval.endsWith(':00')) {
        plots.push({
          time: adjustedInterval,
          displayTime: formattedInterval,
          averageWait: waitTime,
        });
      }
    }

    return { plots, fullPlots };
  };

  // Helper function to adjust the interval to start at 8 AM
  const adjustInterval = (index, startHour) => {
    const adjustedHour = Math.floor(index / 12) + startHour;
    const adjustedMinute = (index % 12) * 5;
    return `${adjustedHour}:${adjustedMinute < 10 ? `0${adjustedMinute}` : adjustedMinute}`;
  };

  // Toggle expanded state for a particular hour
  const toggleExpand = (hourIndex) => {
    setExpandedHour(expandedHour === hourIndex ? null : hourIndex);
  };

  return (
    <div className="container">
      {/* Back Button */}
      <div className="back-button" onClick={() => navigate(-1)}>
        ← {/* Simple arrow */}
      </div>

      <h1 className="header">{rideName}</h1>

      {/* Line chart displaying the average wait times */}
      <div style={{ backgroundColor: 'rgba(100, 100, 100, 0.7)', padding: '10px', borderRadius: '5px' }}> {/* Black background with padding and rounded corners */}
      <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayTime" interval={0} tick={{ fill: 'white', fontSize: 12 }}  /> {/* Ensure all labels are shown */}
            <YAxis domain={[0, maxWaitTime]} tick={{ fill: 'white', fontSize: 12 }} /> {/* Customize the text color and size */}            
            <Tooltip 
            contentStyle={{ backgroundColor: '#222', borderRadius: '5px' }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            />
            <Legend />
              <Line 
              type="monotone" 
              dataKey="averageWait" 
              stroke="white" 
              activeDot={{ r: 8 }} 
              name="Average Wait"
              />          
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ul className="timeList">
        {chartData.map((hourData, hourIndex) => (
          <li key={hourIndex} className="hourItem">
            <div onClick={() => toggleExpand(hourIndex)} style={{cursor: 'pointer'}}>
              <strong>{hourData.displayTime}</strong>: {formatTime(hourData.averageWait)}
            </div>
            {expandedHour === hourIndex && (
              <ul className="minuteList">
                {fullData
                  .filter(minuteData => minuteData.time.startsWith(hourData.time.split(':')[0]))
                  .map((minuteData, minuteIndex) => (
                    <li key={minuteIndex} className="minuteItem">
                      {minuteData.displayTime}: {formatTime(minuteData.averageWait)}
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div style={{ height: '30px' }} /> {/* Spacer element */}

      <footer className="footer">
        <p>Powered by <a href="https://queue-times.com/en-US/pages/api" target="_blank" rel="noopener noreferrer">Queue Times</a></p>
      </footer>
    </div>
  );
}

export default RideDetailsPage;
