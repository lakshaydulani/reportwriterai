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
      <div className="bg-white p-8 rounded shadow-md w-3/4 h-3/4" ref={popupRef}>
        <h2 className="text-2xl font-bold mb-4">Persona</h2>
        <textarea
          placeholder="Enter Your Persona"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full p-4 mb-6 border border-gray-300 rounded h-3/4"
        />
        <div className="flex float-end">
        <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
