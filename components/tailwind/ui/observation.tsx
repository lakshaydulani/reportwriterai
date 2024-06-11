import React, { useState, useEffect } from 'react';
import { Button } from './button';

const ObservationComponent = () => {
  const [observations, setObservations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedObservations = localStorage.getItem('observations');
      const savedIndex = localStorage.getItem('selectedIndex');
      
      if (savedObservations) {
        setObservations(JSON.parse(savedObservations));
      }
      
      if (savedIndex) {
        setSelectedIndex(JSON.parse(savedIndex));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('observations', JSON.stringify(observations));
    }
  }, [observations]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedIndex', JSON.stringify(selectedIndex));
    }
  }, [selectedIndex]);

  const addObservation = () => {
    const newObservation = `Observation ${observations.length + 1}`;
    setObservations([...observations, newObservation]);
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div>
      <Button 
        variant="default"
        onClick={addObservation}
        className="mb-2 mt-2"
      >
        Add New Observation
      </Button>
      <ol>
        {observations.map((observation, index) => (
          <li
            key={index}
            onClick={() => handleSelect(index)}
            style={{
              cursor: 'pointer'
            }}
          >
            <Button 
              size="lg"
              className={`rounded-xl w-full my-2 hover:bg-yellow-300 ${selectedIndex === index ? 'bg-ey-yellow' : ''}`}
              variant="default"
            >
            {observation}
            </Button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ObservationComponent;
