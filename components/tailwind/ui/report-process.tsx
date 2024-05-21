"use client";
import React from 'react';
import { DownloadIcon, SendIcon as MailIcon, SparklesIcon } from "lucide-react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { BookmarkIcon } from "lucide-react";
import { Loader } from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";


const ReportProcess = () => {

  const [prompt, setPrompt] = React.useState("");

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
      alert("loading");
      const result = complete(completion, {
        body: { option: "generate", command: prompt },
      });
      console.log(result);
    }
  }



  return (
    <>
      <div className="bg-neutral-400 border border-2 border-violet-700 p-6 rounded-lg shadow-lg mt-4">

        <div className="relative w-full max-w-lg">

          <svg className="absolute top-3 left-3 w-7 h-7" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256" /><line fill="none" stroke="purple" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="216" x2="216" y1="128" y2="176" /><line fill="none" stroke="purple" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="192" x2="240" y1="152" y2="152" /><line fill="none" stroke="purple" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="84" x2="84" y1="40" y2="80" /><line fill="none" stroke="purple" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="64" x2="104" y1="60" y2="60" /><line fill="none" stroke="purple" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="168" x2="168" y1="184" y2="216" /><line fill="none" stroke="purple" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="152" x2="184" y1="200" y2="200" /><rect fill="none" height="45.25" rx="8" stroke="purple" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" transform="translate(-53 128) rotate(-45)" width="226.3" x="14.9" y="105.4" /><line fill="none" stroke="purple" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="144" x2="176" y1="80" y2="112" /></svg>

          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full text-xl p-3 pl-12 border border-gray-300 rounded-lg focus:ring-blue-500" rows={5} placeholder="Write with AI"></textarea>
        </div>

          {/* <Button variant="default" size="default">
            <BookmarkIcon /> Bookmark
          </Button>
          <Button variant="default" size="default">
            <BookmarkIcon /> Bookmark
          </Button>    <Button variant="default" size="default">
            <BookmarkIcon /> Bookmark
          </Button>    <Button variant="default" size="default">
            <BookmarkIcon /> Bookmark
          </Button>    <Button variant="default" size="default">
            <BookmarkIcon /> Bookmark
          </Button> */}

        <button className="mt-2 bg-violet-700 hover:bg-violet-950 flex w-full justify-center items-center text-white font-bold py-4 px-8 rounded-lg"
          onClick={() => { generateReport() }}
        >
          <SparklesIcon className="mx-2" />
          {/* <Loader /> */}
          Generate</button>

        <hr className='mt-6 border-black' />

        <button className="mt-6 bg-zinc-800 hover:bg-gray-950 flex w-full justify-center items-center text-white font-bold py-4 px-8 rounded-lg">
          <DownloadIcon className="mx-2" />
          Download Report</button>

      </div>

      {/* <div className="bg-neutral-400 p-6 rounded-lg mt-4">
        <button className="mt-1 bg-zinc-800 hover:bg-gray-950 flex w-full justify-center items-center text-white font-bold py-4 px-8 rounded-lg">
          <DownloadIcon className="mx-2" />
          Download Report</button>

        <button className="mt-4 bg-zinc-700 hover:bg-gray-950 flex w-full justify-center items-center text-white font-bold py-4 px-8 rounded-lg">
          <MailIcon className="mx-2" />
          Send for review</button>
      </div> */}


    </>
  );
};

export default ReportProcess;
