import React, { useState, useEffect } from 'react';
import { Button } from './button';

const ObservationComponent = () => {
  const [observations, setObservations] = useState(() => {
    const savedObservations = localStorage.getItem('observations');
    return savedObservations ? JSON.parse(savedObservations) : [];
  });

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const savedIndex = localStorage.getItem('selectedIndex');
    return savedIndex ? JSON.parse(savedIndex) : null;
  });

  useEffect(() => {
    localStorage.setItem('observations', JSON.stringify(observations));
  }, [observations]);

  useEffect(() => {
    localStorage.setItem('selectedIndex', JSON.stringify(selectedIndex));
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
              cursor: 'pointer',
              fontWeight: selectedIndex === index ? 'bold' : 'normal'
            }}
          >
            <Button 
              size="lg"
              className="rounded-xl w-full my-2"
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
