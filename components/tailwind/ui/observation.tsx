import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { useAtom } from 'jotai';
import { generatedContent } from '@/lib/atom';
import { initialContent } from '@/lib/atom';

const ObservationComponent = () => {
  const [observations, setObservations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [ content, setContent ]  = useAtom(generatedContent);
  const [ newInitialContent, setNewInitialContent ]  = useAtom(initialContent);
  const [contentArray, setContentArray] = useState([]);
  const globalObservation = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Add your observation " + (selectedIndex + 1),
          },
        ],
      },
    ],
  };

  const addObservation = () => {
    setContentArray([...contentArray, content]);
    setContent(globalObservation);
    setNewInitialContent(globalObservation);
    setSelectedIndex(observations.length);
    const newObservation = `Observation ${observations.length + 1}`;
    const newObservations = [...observations, newObservation];
    setObservations(newObservations);

    // Set the new selected index to the last observation
  };

  const handleSelect = (index) => {
    if(contentArray[index+1]){
      setNewInitialContent(contentArray[index+1])
      setContent(contentArray[index+1])
    }
    setSelectedIndex(index);
    console.log("content array is ;;;;;;\n", contentArray);
  };

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
            className='cursor-pointer'
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
