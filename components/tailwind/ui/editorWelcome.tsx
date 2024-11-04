import React from 'react';
import "@/styles/globals.css";
import { Send } from 'lucide-react';
import { motion } from "framer-motion";
import { Tooltip } from 'react-tooltip';

const EditorWelcome = (props) => {

  const onButtonClick = (value) => {
    props.parentCallback(value);
  }

  const buttonsName = [
    {name:'draft',title:'Draft an Observation'},
    {name:'review',title:'Review Your Observation'}
    // {name:'summary',title:'Generate Executive Summary'},
    // {name:'fact',title:'Generate Issue Facts'},
    // {name:'committee',title:'Generate Audit Committee'}
  ];

  return (
    <section className='p-4 bg-zinc-200 shadow-lg h-full'>
      <div className='text-center mb-4'>
        <p><strong>Hi! </strong>I am your writing assistant</p>
        <p><strong>I can help you write, edit or summarize!</strong></p>
        <p>Tell me, what would you like to draft today?</p>
      </div>
      <div className='text-left'>
        <ul>
          {
            buttonsName.map((item) => {
              return (
                <motion.li
                  className='flex justify-between items-center m-2 p-2 myList text-white cursor-pointer list-none border gap-y-4'
                  onClick={() => onButtonClick(item.name)}
                  whileHover={{ scale: 1.03, backgroundColor: "grey" }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  data-tooltip-id={item.name}
                >
                  <span>{item.title}</span>
                  <Send />
                </motion.li>
              )
            })
          }
        </ul>
        <Tooltip id="draft" place="left" style={{ backgroundColor: "Pink", color: "#222" }}>
          "Observation provide audit findings, associated risk and how to fix them."   
        </Tooltip>
        <Tooltip id="review" place="left">
          "Helps you identify and address Queries Manager / Partner would ask."
        </Tooltip>
      </div>
    </section>
  );
};

export default EditorWelcome;
