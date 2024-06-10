import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from "jotai";
import { persona, isEYFontRequired } from "@/lib/atom";
import { Button } from './button';
import { Atom, Bug, Settings, SparklesIcon, AlignJustify, FerrisWheel, SquareAsterisk } from "lucide-react";
import {
  generatedContent,
  initialContent as initialContentAtom,
} from "@/lib/atom";

const Popup = ({ onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useAtom(persona);
  const [isEyFormatingRequired, setIsEyFormatingRequired] = useAtom(isEYFontRequired);
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
  const popupRef = useRef(null);
  const [selectedButton, setSelectedButton] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setIsEyFormatingRequired(e.target.checked);
  };

  const handleSubmit = () => {
    onSubmit(inputValue, isEyFormatingRequired);
    setSelectedButton(inputValue);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        e.stopPropagation();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const getSettings = async (value) => {
    try {
        const response = await fetch(`/api/settings?field=${value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const keys = Object.keys(data);
        const result = data[keys[0]];
        setTimeout((result) => {
            setInputValue(result);
        }, 1000, result);
        
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
};


  const handleSave = async () => {
    try {
        let obj = {};
        obj[selectedButton.toLowerCase()] = inputValue;

        const res = await fetch("/api/settings", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),  // Ensure the payload is stringified
        });

        console.log("Request sent, awaiting response...");

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Response data:", data);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("Request timed out");
        } else {
            console.error("Error encountered:", error);
        }
    }
};

  

  const Section = () => {
    const appendSection = (value) => () => {
      setSelectedButton(value); // Set the selected button
      getSettings(value);
    };

    const option = [
      {
        label: "Header",
        icon: AlignJustify
      },
      {
        label: "Background",
        icon: Atom
      },
      {
        label: "Issue Summary",
        icon: Bug
      },
      {
        label: "Detailed observation",
        icon: FerrisWheel
      },
      {
        label: "Risk/ Impact",
        icon: SquareAsterisk
      },
      {
        label: "Root cause",
        icon: SquareAsterisk
      },
      {
        label: "Recommendation",
        icon: SquareAsterisk
      },
      {
        lable : "Management Comment",
        icon : SquareAsterisk
      },
    ];
    return (
      <div className="m-2 flex flex-wrap gap-2">
        {option.map((item) => {
          const isSelected = selectedButton === item.label;
          return (
            <Button
              key={item.label}
              onClick={appendSection(item.label)}
              className={`w-full rounded-xl ${isSelected ? 'bg-ey-yellow hover:bg-ey-yellow' : ''}`}
            >
              <item.icon className="float-left mr-auto" />
              {item.label}
            </Button>
          );
        })}
      </div>
    );
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-3/4 h-3/4 max-h-screen" ref={popupRef}>
        <h2 className="text-2xl font-bold mb-4">Setting</h2>
        <div className="flex flex-1 overflow-hidden h-[calc(100%-100px)]">
          <div className="flex flex-col mr-2 p-2 border border-gray-300 w-1/4 overflow-y-auto">
            <Section />
            {/* Add more buttons as needed */}
          </div>
          <textarea
            placeholder="Enter Your Persona"
            value={inputValue}
            onChange={handleInputChange}
            className="flex-1 p-4 border border-gray-300 rounded resize-none overflow-y-auto"
          />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isEyFormatingRequired}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Use EY Font
          </div>
          <div className="flex">
            <button
              onClick={handleSave}
              className="bg-ey-yellow py-2 px-4 rounded mr-2 border border-black"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-black text-white py-2 px-4 rounded hover:bg-red-600 "
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
