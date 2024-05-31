"use client";
import React from "react";
import { UploadIcon } from "lucide-react";
import { Dropzone } from "./Dropzone";
import SectionHeading from "./section-heading";

const Uploader = () => {
  return (
    <section>
      <SectionHeading>
        {/* <UploadIcon /> */}
        Upload your current report:</SectionHeading>
        <Dropzone className='uploader p-3 text-white' />
    </section>
  );
};

export default Uploader;
