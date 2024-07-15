import React from 'react';
import "@/styles/globals.css";
import { motion } from "framer-motion";
const EditorWelcome = (props) => {

  const onButtonClick = (value) => {
    props.parentCallback(value);
  }

  const buttonsName = [
    {name:'draft',title:'Draft an Observation'},
    {name:'review',title:'Review Your Observation'},
    {name:'summary',title:'Generate Executive Summary'},
    {name:'fact',title:'Generate Issue Facts'},
    {name:'committee',title:'Generate Audit Committee'}
  ];

  return (
    <section className='p-4 bg-white rounded-lg shadow-lg'>
      <div className='text-center mb-4'>
        <p><strong>Hi User! </strong>I am your writing assistant
        I can help you write, edit, or summarize!
        Tell me, what would you like to draft today?</p>
      </div>
      <div className='text-left'>
        <ul className=''>
          {
            buttonsName.map((item) => {
                return <motion.li
                  className='m-2 p-2 myList cursor-pointer list-none'
                  onClick={() => onButtonClick(item.name)}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                  {item.title}
                </motion.li>
            })
          }
        </ul>
      </div>
    </section>
  );
};

export default EditorWelcome;
