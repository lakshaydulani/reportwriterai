import React from 'react';

const SectionHeading = ({ children, helptext }) => {
  return (
    <div className='mb-3 text-xl font-bold'>
      <i>{children}</i>
      {helptext && <small className='block text-xs font-light'>{helptext}</small>}
    </div>
  );
};

export default SectionHeading;
