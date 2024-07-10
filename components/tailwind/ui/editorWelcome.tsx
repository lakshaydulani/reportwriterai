import React from 'react';
import "@/styles/globals.css";

const EditorWelcome = (props) => {

  const onButtonClick = (value) => {
    props.parentCallback(value);
  }

  return (
    <section className='p-4 bg-white rounded-lg shadow-lg'>
      <div className='text-center mb-4'>
        <p><strong>Hi User! </strong>I am your writing assistant
        I can help you write, edit, or summarize!
        Tell me, what would you like to draft today?</p>
      </div>
      <div className='text-left'>
        <ul className=''>
          <li
            className='m-2 p-2 myList cursor-pointer'
            onClick={()=>onButtonClick('draft')}
          >                        
            Draft an Observation            
          </li>
          <li
            className='m-2 p-2 myList cursor-pointer'
            onClick={()=>onButtonClick('review')}
          >            
            Review Your Observation            
          </li>
          
          <li
            className='m-2 p-2 myList cursor-pointer'
            onClick={()=>onButtonClick('summary')}
          >
            Generate Executive Summary
          </li>
          <li
            className='m-2 p-2 myList cursor-pointer'
            onClick={()=>onButtonClick('committee')}
          >
            Generate Issue Facts
          </li>
          <li
            className='m-2 p-2 myList cursor-pointer'
            onClick={()=>onButtonClick('committee')}
          >
            Generate Audit Committee
          </li>
        </ul>
      </div>
    </section>
  );
};

export default EditorWelcome;
