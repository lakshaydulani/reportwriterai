import React from 'react';
import { UploadIcon } from "lucide-react";

const Uploader
 = () => {
  return (
    <button className="rounded-lg flex w-full justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8">
      <UploadIcon className="mx-2
" />
      Upload Report
    </button>
  );
};

export default Uploader;
