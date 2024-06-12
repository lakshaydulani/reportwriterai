import React, { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { useAtom } from 'jotai';
import { generatedContent, initialContent } from '@/lib/atom';

const ObservationComponent = () => {
  const [observations, setObservations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [content, setContent] = useAtom(generatedContent);
  const [newInitialContent, setNewInitialContent] = useAtom(initialContent);
  const [contentArray, setContentArray] = useState([]);
  const previousIndex = useRef(null);

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
    if (selectedIndex !== null && previousIndex.current !== null) {
      const newArray = [...contentArray];
      newArray[previousIndex.current] = content;
      setContentArray(newArray);
    }

    setContentArray((contentArray) => [...contentArray, globalObservation]);
    setSelectedIndex(observations.length);
    setContent(globalObservation);
    setNewInitialContent(globalObservation);
    setObservations((obs) => [...obs, `Observation ${obs.length + 1}`]);
  };

  const handleSelect = (index) => {
    if (previousIndex.current !== null) {
      const newArray = [...contentArray];
      newArray[previousIndex.current] = content;
      setContentArray(newArray);
    }
    previousIndex.current = index;

    if (contentArray[index]) {
      setNewInitialContent(contentArray[index]);
      setContent(contentArray[index]);
    } else {
      setNewInitialContent(globalObservation);
      setContent(globalObservation);
    }
    setSelectedIndex(index);
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
          <li
            key={index}
            onClick={() => handleSelect(index)}
            className="cursor-pointer"
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
