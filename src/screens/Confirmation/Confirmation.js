import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Confirmation = () => {
  const location = useLocation();
  const { selectedPages } = location.state;

  const handleConfirmClick = async () => {

    try {
      await axios.post('/api/connect-pages', { selectedPages });
      console.log('Pages connected successfully!');
    } catch (error) {
      console.error('Error connecting pages:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Confirmation</h2>
      <ul>
        {selectedPages.map((pageId) => (
          <li key={pageId}>{pageId}</li>
        ))}
      </ul>

      <button onClick={handleConfirmClick}>Confirm and Connect</button>
    </div>
  );
};

export default Confirmation;
