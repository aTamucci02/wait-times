import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import ParkPage from './components/ParkPage/ParkPage';
import RideDetailsPage from './components/RideDetailsPage/RideDetailsPage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/park/:parkId" element={<ParkPage />} />
        <Route path="/ride/:rideId" element={<RideDetailsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
