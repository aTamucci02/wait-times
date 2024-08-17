import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './RideDetailsPage.css';

function RideDetailsPage() {
  const { rideId } = useParams();

  const [chartData, setChartData] = useState([]);
  const [fullData, setFullData] = useState([]); // Store all 5-minute intervals
  const [expandedHour, setExpandedHour] = useState(null); // Track which hour is expanded

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/rides/${rideId}/average-wait-times/interval`)
      .then(response => {
        const data = response.data;
        console.log(data)
        const { plots, fullPlots } = createPlots(data);
        setChartData(plots);  // Data for the chart and hourly list
        setFullData(fullPlots); // Data for all 5-minute intervals
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

  // Helper function to shift and format the interval
  const formatInterval = (interval) => {
    let [hour, minute] = interval.split(':').map(Number);
    hour -= 2; // Shift time back by 2 hours
    if (hour < 0) {
      hour += 24; // Adjust for midnight wrap-around
    }
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

      // Push all intervals into fullPlots
      fullPlots.push({
        time: adjustedInterval,
        displayTime: formattedInterval,
        averageWait: waitTimes[index].average_wait_time,
      });

      // Only push the top of the hour to plots
      if (adjustedInterval.endsWith(':00')) {
        plots.push({
          time: adjustedInterval,
          displayTime: formattedInterval,
          averageWait: waitTimes[index].average_wait_time,
        });
      }
    }

    return { plots, fullPlots };
  };

  // Helper function to check if the time is between 8 AM and 10 PM
  const isWithinOperatingHours = (interval) => {
    const [hour] = interval.split(':').map(Number);
    return hour >= 8 && hour < 22; // 8 AM to 10 PM is 8:00 to 21:59
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
      <h1 className="header">test</h1>

      {/* Line chart displaying the average wait times */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayTime" interval={0} /> {/* Ensure all labels are shown */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="averageWait" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ul className="timeList">
        {chartData.map((hourData, hourIndex) => (
          <li key={hourIndex} className="hourItem">
            <div onClick={() => toggleExpand(hourIndex)}>
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
    </div>
  );
}

export default RideDetailsPage;
