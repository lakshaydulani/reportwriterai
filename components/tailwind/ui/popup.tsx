import React, { useState, useRef, useEffect } from 'react';

const Popup = ({ onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');
  const popupRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-96" ref={popupRef}>
        <textarea
          placeholder="Enter Your Persona"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full p-4 mb-6 border border-gray-300 rounded h-40"
        />
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
