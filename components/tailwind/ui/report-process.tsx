"use client";
import React from 'react';
import { DownloadIcon, SendIcon as MailIcon, SparklesIcon } from "lucide-react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";

const ReportProcess = () => {


  const { completion, complete, isLoading } = useCompletion({
    // id: "novel",
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const generateReport = () => {
    console.log({ completion, complete }, "<<<");
    if (completion) {
      const result = complete(completion, {
        body: { option: "generate", command: prompt },
      });
      console.log(result);
    }
  }



  return (
    <>
      <div className="bg-neutral-400 border border-2 border-violet-700 p-6 rounded-lg shadow-lg mt-4">

     

        {/* <hr className='mt-6 border-black' /> */}

        <button className="mt-6 bg-zinc-800 hover:bg-gray-950 flex w-full justify-center items-center text-white font-bold py-4 px-8 rounded-lg">
          <DownloadIcon className="mx-2" />
          Download Report</button>

      </div>

    
    </>
  );
};

export default ReportProcess;
