'use client';
import React, { useState } from 'react';

const TextBoxWithSubmit = () => {
  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Submitted text: ${text}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <p className='text-3xl font-bold'>Enter Your Persona</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={20}
        cols={150}
        style={{ fontSize: '16px', padding: '10px' }}
      />
      <button type="submit" className='bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600'>
        Submit
      </button>
    </form>
  );
};

export default TextBoxWithSubmit;
