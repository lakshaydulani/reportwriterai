"use client";
import React from "react";
import { UploadIcon } from "lucide-react";
import { Dropzone } from "./Dropzone";
import SectionHeading from "./section-heading";

const Uploader = () => {
  return (
    <section>
      <SectionHeading><UploadIcon />Upload your current report:</SectionHeading>
        <Dropzone className='p-16 mt-10 border border-red-200' />
    </section>
  );
};

export default Uploader;
