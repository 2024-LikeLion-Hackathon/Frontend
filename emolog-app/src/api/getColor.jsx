import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const getColor = ({ month }) => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/color?month=${month}`);
        setColors(response.data);
      } catch (err) {
        setError('Failed to fetch color data');
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, [month]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Color Data for Month: {month}</h2>
      <ul>
        {colors.map((colorData, index) => (
          <li key={index}>
            <p>Date: {colorData.date}</p>
            <p>Color: {colorData.hexa}</p>
            <p>Day of Week: {colorData.dayOfWeek}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
