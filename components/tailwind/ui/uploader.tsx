'use client';
import React from 'react';
import { UploadIcon } from "lucide-react";
import { Dropzone } from './Dropzone';

const Uploader
 = () => {
  return (
    <section className='section'>
      <div className='container'>
        <h1 className='title text-3xl font-bold text-center'>Upload File</h1>
        <Dropzone className='p-5 mt-5 border border-red-200' />
      </div>
    </section>
  );
};

export default Uploader;
