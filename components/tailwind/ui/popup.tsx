import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from "jotai";
import { persona, isEYFontRequired } from "@/lib/atom";
import useLocalStorage from "@/hooks/use-local-storage";
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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setIsEyFormatingRequired(e.target.checked);
  };

  const handleSubmit = () => {
    onSubmit(inputValue, isEyFormatingRequired);
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

  const Section = () => {
    const appendSection = (value) => () => {
      const newContent = {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [
              {
                type: "text",
                text: value,
              },
            ],
          },
        ],
      };
    };

    const option = [
      {
        lable : "Header",
        icon : AlignJustify
      },
      {
        lable : "Background",
        icon : Atom
      },
      {
        lable : "Issue Summary",
        icon : Bug
      },
      {
        lable : "Detailed observation",
        icon : FerrisWheel
      },
      {
        lable : "Risk/ Impact",
        icon : SquareAsterisk
      },
      {
        lable : "Root cause",
        icon : SquareAsterisk
      },
      {
        lable : "Recommendation",
        icon : SquareAsterisk
      },
      {
        lable : "Management Comment",
        icon : SquareAsterisk
      },
    ];
    return (
      <div className="my-3 flex flex-wrap gap-1">
        {option.map((item) => {
          return (
            <div className="my-1 px-2 text-sm font-semibold">
              <Button
                onClick={appendSection(item.lable)}
                size="sm"
                className="rounded-xl w-full border-black"
                variant="outline"
              >
                <item.icon className="float-left" />
                {item.lable}
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-3/4 h-3/4 max-h-screen" ref={popupRef}>
        <h2 className="text-2xl font-bold mb-4">Persona</h2>
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
              onClick={handleSubmit}
              className="bg-ey-yellow py-2 px-4 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-black text-white py-2 px-4 rounded hover:bg-red-600"
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
