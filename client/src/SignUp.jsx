import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css'; // Import custom CSS file for SignUp component

const SignUp = ({ onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/signup', { email, password });
      const { message } = response.data;
      if (message === 'User created successfully') {
        onSignUp();
      } else if (message === 'User already exists') {
        setError('User already exists');
      } else {
        setError('An error occurred during sign up. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      setError('user created succfully');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
