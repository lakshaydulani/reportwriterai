import React, { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { useAtom } from 'jotai';
import { generatedContent, initialContent } from '@/lib/atom';
import { Trash2 } from 'lucide-react';

const ObservationComponent = () => {
  const [observations, setObservations] = useState(() => {
    const savedObservations = localStorage.getItem('observations');
    return savedObservations ? JSON.parse(savedObservations) : [];
  });

  const [contentArray, setContentArray] = useState(() => {
    const savedContentArray = localStorage.getItem('contentArray');
    return savedContentArray ? JSON.parse(savedContentArray) : [];
  });

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [content, setContent] = useAtom(generatedContent);
  const [newInitialContent, setNewInitialContent] = useAtom(initialContent);
  const previousIndex = useRef(null);

  useEffect(() => {
    console.log('Loaded from localStorage:', { observations, contentArray });
  }, []);

  useEffect(() => {
    console.log('Saving to localStorage:', { observations, contentArray });
    window.localStorage.setItem('observations', JSON.stringify(observations));
    window.localStorage.setItem('contentArray', JSON.stringify(contentArray));
  }, [observations, contentArray]);

  const globalObservation = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Add your observation ' + (observations.length + 1),
          },
        ],
      },
    ],
  };

  const addObservation = () => {
    if (observations.length === 0) {
      // Adding the first two observations
      const firstObservation = content;
      const secondObservation = globalObservation;

      setContentArray([firstObservation, secondObservation]);
      setObservations(['Observation 1', 'Observation 2']);
      setSelectedIndex(1); // Select the second observation by default
      setContent(globalObservation);
      setNewInitialContent(globalObservation);
      previousIndex.current = 1;
    } else {
      // Save current content before adding a new observation
      if (selectedIndex !== null) {
        const newArray = [...contentArray];
        newArray[selectedIndex] = content;
        setContentArray(newArray);
      }

      setContentArray((contentArray) => [...contentArray, globalObservation]);
      setObservations((obs) => [...obs, `Observation ${obs.length + 1}`]);
      setSelectedIndex(observations.length); // Select the new observation
      setContent(globalObservation);
      setNewInitialContent(globalObservation);
      previousIndex.current = observations.length; // Update previous index
    }
  };

  const handleSelect = (index) => {
    // Save current content before switching
    if (selectedIndex !== null) {
      const newArray = [...contentArray];
      newArray[selectedIndex] = content;
      setContentArray(newArray);
    }

    // Switch to the selected observation
    setSelectedIndex(index);
    setContent(contentArray[index]);
    setNewInitialContent(contentArray[index]);
    previousIndex.current = index;
  };

  const handleDelete = (index) => {
    // Remove the selected observation
    const updatedObservations = observations.filter((_, i) => i !== index);
    const updatedContentArray = contentArray.filter((_, i) => i !== index);

    setObservations(updatedObservations);
    setContentArray(updatedContentArray);

    // Update localStorage
    window.localStorage.setItem('observations', JSON.stringify(updatedObservations));
    window.localStorage.setItem('contentArray', JSON.stringify(updatedContentArray));

    // Handle the case when the deleted observation was selected
    if (index === selectedIndex) {
      setSelectedIndex(null);
      setContent(null);
      setNewInitialContent(null);
    } else if (index < selectedIndex) {
      setSelectedIndex(selectedIndex - 1);
    }

    previousIndex.current = null;
  };

  useEffect(() => {
    // Save the current observation's content when the selected index changes
    if (previousIndex.current !== null && previousIndex.current !== selectedIndex) {
      const newArray = [...contentArray];
      newArray[previousIndex.current] = content;
      setContentArray(newArray);
    }
  }, [selectedIndex]);

  return (
    <div>
      <Button
        variant="default"
        onClick={addObservation}
        className="rounded-xl w-full mb-2 mt-2"
      >
        Add New Observation
      </Button>
      <ol>
        {observations.map((observation, index) => (
          <li key={index} className="cursor-pointer">
            <Button
              size="lg"
              className={`flex justify-between items-center rounded-xl w-full my-2 hover:bg-yellow-300 ${selectedIndex === index ? 'bg-ey-yellow' : ''}`}
              variant="default"
              onClick={() => handleSelect(index)}
            >
              {observation}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the select handler from being triggered
                  handleDelete(index);
                }}
                className="ml-2 text-red-600"
              >
                <Trash2 />
              </button>
            </Button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ObservationComponent;
