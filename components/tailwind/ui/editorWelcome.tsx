import React from 'react';

const EditorWelcome = (props) => {

  const onButtonClick = (event) => {
    props.parentCallback(event.target.value);
    console.log("handle button click event value\n........",event.target.value);
  }

  return (
    <section className=''>
      <div className='text-center mb-4'>
        <strong>Hi User!</strong>
        <p>I am your writing assistant</p>
        <p>I can help you write, edit, or summarize!</p>
        <p>Tell me, what would you like to draft today?</p>
      </div>
      <div className='text-left'>
        <ol className='list-decimal list-inside'>
          <li>
            <button 
              className='m-2 p-2 border border-black'
              value='draft'
              onClick={onButtonClick}

            >
              Draft an Observation
            </button>
          </li>
          <li>
            <button 
              className='m-2 p-2 border border-black'
              value='review'
              onClick={onButtonClick}
            >
              Review Your Observation
            </button>
          </li>
          <li>
            <button 
              className='m-2 p-2 border border-black'
              value='generate'
              onClick={onButtonClick}
            >
              Review Your Observations
            </button>
          </li>
          <li>
            <button 
              className='m-2 p-2 border border-black'
              value='summary'
              onClick={onButtonClick}
            >
              Generate Executive Summary
            </button>
          </li>
          <li>
            <button 
              className='m-2 p-2 border border-black'
              value='fact'
              onClick={onButtonClick}
            >
              Generate Issue Facts
            </button>
          </li>
          <li>
            <button 
              className='m-2 p-2 border border-black'
              value='committee'
              onClick={onButtonClick}
            >
              Generate Audit Committee
            </button>
          </li>
        </ol>
      </div>
    </section>
  );
};

export default EditorWelcome;
