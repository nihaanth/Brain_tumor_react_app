import React, { useState } from 'react';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import ImageUpload from './ImageUpload.jsx';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // New state to control displaying login or signup form
  const [prediction, setPrediction] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPrediction(null); // Clear prediction on logout
  };

  const handlePrediction = (data) => {
    console.log("Prediction:", data);
    setPrediction(data.prediction);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="app-container">
          <h1>User Management System</h1>
          <button className='logout-button' onClick={handleLogout}>Logout</button>
          <ImageUpload onPrediction={handlePrediction} />
          {prediction !== null && <h2>Prediction: {prediction}</h2>}
        </div>
      ) : (
        <div className="login-container">
          {showLogin ? ( // Show login form if showLogin is true
            <>
              <Login onLogin={handleLogin} />
              {/* Toggle button to switch to signup form */}
              <button className="toggle-button" onClick={() => setShowLogin(false)}>
                Switch to Sign Up
              </button>
            </>
          ) : ( // Otherwise show signup form
            <>
              <SignUp onLogin={handleLogin} />
              {/* Toggle button to switch to login form */}
              <button className="toggle-button" onClick={() => setShowLogin(true)}>
                Switch to Login
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default App;