'use client';
import React from 'react';
import { UploadIcon } from "lucide-react";
import { Dropzone } from './Dropzone';

const Uploader
 = () => {
  return (
    <section className='section'>
      <div className='container'>
        <h1 className='title text-3xl font-bold'>Upload Files</h1>
        <Dropzone className='p-16 mt-10 border border-neutral-200' />
      </div>
    </section>
  );
};

export default Uploader;
