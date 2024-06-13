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

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const savedIndex = localStorage.getItem('selectedIndex');
    return savedIndex !== null ? JSON.parse(savedIndex) : null;
  });

  const [content, setContent] = useAtom(generatedContent);
  const [newInitialContent, setNewInitialContent] = useAtom(initialContent);
  const previousIndex = useRef(null);

  useEffect(() => {
    console.log('Loaded from localStorage:', { observations, contentArray, selectedIndex });
    if (selectedIndex !== null && contentArray[selectedIndex]) {
      setContent(contentArray[selectedIndex]);
      setNewInitialContent(contentArray[selectedIndex]);
    }
  }, []);

  useEffect(() => {
    console.log('Saving to localStorage:', { observations, contentArray, selectedIndex });
    window.localStorage.setItem('observations', JSON.stringify(observations));
    window.localStorage.setItem('contentArray', JSON.stringify(contentArray));
    window.localStorage.setItem('selectedIndex', JSON.stringify(selectedIndex));
  }, [observations, contentArray, selectedIndex]);

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
      const firstObservation = content;
      const secondObservation = globalObservation;

      setContentArray([firstObservation, secondObservation]);
      setObservations(['Observation 1', 'Observation 2']);
      setSelectedIndex(1);
      setContent(globalObservation);
      setNewInitialContent(globalObservation);
      previousIndex.current = 1;
    } else {
      if (selectedIndex !== null) {
        const newArray = [...contentArray];
        newArray[selectedIndex] = content;
        setContentArray(newArray);
      }

      setContentArray((contentArray) => [...contentArray, globalObservation]);
      setObservations((obs) => [...obs, `Observation ${obs.length + 1}`]);
      setSelectedIndex(observations.length);
      setContent(globalObservation);
      setNewInitialContent(globalObservation);
      previousIndex.current = observations.length;
    }
  };

  const handleSelect = (index) => {
    if (selectedIndex !== null) {
      const newArray = [...contentArray];
      newArray[selectedIndex] = content;
      setContentArray(newArray);
    }

    setSelectedIndex(index);
    setContent(contentArray[index]);
    setNewInitialContent(contentArray[index]);
    previousIndex.current = index;
  };

  const handleDelete = (index) => {
    const updatedObservations = observations.filter((_, i) => i !== index);
    const updatedContentArray = contentArray.filter((_, i) => i !== index);

    setObservations(updatedObservations);
    setContentArray(updatedContentArray);

    window.localStorage.setItem('observations', JSON.stringify(updatedObservations));
    window.localStorage.setItem('contentArray', JSON.stringify(updatedContentArray));

    if (index === selectedIndex) {
      const nextIndex = index < updatedObservations.length ? index : index - 1;
      if (nextIndex >= 0) {
        setSelectedIndex(nextIndex);
        setContent(updatedContentArray[nextIndex]);
        setNewInitialContent(updatedContentArray[nextIndex]);
      } else {
        setSelectedIndex(null);
        setContent(null);
        setNewInitialContent(null);
      }
    } else if (index < selectedIndex) {
      setSelectedIndex(selectedIndex - 1);
    }

    previousIndex.current = null;
  };

  useEffect(() => {
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
              {observations.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  className="ml-2 text-red-600"
                >
                  <Trash2 />
                </button>
              )}
            </Button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ObservationComponent;
