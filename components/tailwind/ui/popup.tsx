import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from "jotai";
import { persona, isEYFontRequired } from "@/lib/atom";
import { Button } from './button';
import { sectionOptions as option} from '@/components/tailwind/generative/ai-selector-options';
import {
  initialContent as initialContentAtom,
} from "@/lib/atom";

// Loader component
const EditorSkeleton = () => {
  return (<div className="bg-white rounded-lg w-3/4 h-[calc(100%-100px)] p-8">
    <div role="status" className="animate-pulse">
    <div className="h-8 bg-gray-400 dark:bg-gray-700 w-2/3 mb-10"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[200px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[360px] mb-10"></div>
    <div className="h-8 bg-gray-400 dark:bg-gray-700 w-2/3 mb-2"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[200px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[360px]"></div>
</div>
  </div>);
}

const Popup = ({ onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useAtom(persona);
  const [isEyFormatingRequired, setIsEyFormatingRequired] = useAtom(isEYFontRequired);
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
  const [selectedButton, setSelectedButton] = useState('header');
  const [loading, setLoading] = useState(false); // Loading state
  const [isSaving, setIsSaving] = useState(false);

  const popupRef = useRef(null);

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
    getSettings(selectedButton);
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
      setLoading(true); // Set loading to true while fetching data
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
      setInputValue(result);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false); // Set loading to false when data is received
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true); // Set saving to true when save process starts
      let obj = {};
      obj[selectedButton.toLowerCase()] = inputValue;
  
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
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
    } finally {
      setIsSaving(false); // Set saving to false when save process finishes
    }
  };

  const Section = () => {
    const appendSection = (value) => () => {
      setSelectedButton(value); // Set the selected button
      getSettings(value);
    };

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
              {item.value}
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
          </div>
          {loading ? <EditorSkeleton /> : (
          <textarea
            placeholder="Enter Your Persona"
            value={inputValue}
            onChange={handleInputChange}
            className="flex-1 p-4 border border-gray-300 rounded resize-none overflow-y-auto"
          />
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
          {/* <div className="flex items-center">
            <input
              type="checkbox"
              checked={isEyFormatingRequired}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Use EY Font
          </div> */}
          <div className="flex">
            <button
              onClick={handleSave}
              className={`bg-ey-yellow py-2 px-4 rounded mr-2 border border-black ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSaving} // Disable the button while saving
            >
              {isSaving ? 'Saving...' : 'Save'}
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
