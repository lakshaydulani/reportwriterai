"use client";
import React from "react";
import { useState } from "react";
import { DownloadIcon, SendIcon as MailIcon, SparklesIcon } from "lucide-react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import SectionHeading from "./section-heading";
import { useAtom } from "jotai";
import { initialContent as initialContentAtom, generatedContent} from "@/lib/atom";
import { saveAs } from 'file-saver';
import { Buffer } from 'buffer';



const ReportProcess = () => {
  const [isLoad, setIsLoading] = useState(false);
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
  const [content, setContent] = useAtom(generatedContent);
  const { completion, complete, isLoading } = useCompletion({
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

  const getTextFromInitialContent = (initialContent) => {
    if (initialContent && initialContent?.content?.[0]?.content?.[0]?.text) {
      return initialContent.content[0].content[0].text;
    } else if (initialContent?.text) {
      return initialContent.text;
    }else if(initialContent && typeof(initialContent))
      return initialContent;
    return '';
  };

  const handleDownloadClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/download-file", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(content.content), 
      });

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("response from api",data);
        const base64URL = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + data.file;
        console.log("base64URL is : \n",base64URL);
        try {
          const base64String = base64URL.split(',')[1];
          const binaryString = atob(base64String);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
    
          const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          saveAs(blob, 'downloaded_file.docx');
        } catch (error) {
          console.error('Error downloading the file:', error);
        }
    } catch (error) {
        console.error("Error during download:", error);
    }
    setIsLoading(false);
};
  return (
    <section>
      {/* <SectionHeading helptext="Formatted as per EY Guidelines">Generate Report:</SectionHeading> */}
      <button className="bg-ey-yellow flex w-full justify-center items-center font-bold py-2 px-6 rounded-lg ${
            isLoad ? 'cursor-not-allowed' : ''
          }`"
              onClick={handleDownloadClick}
              disabled={isLoad}
      >
        <DownloadIcon className="mx-2"/>
        {isLoad ? "Downloading..." : "Download Report"}
      </button>
    </section>
  );
};

export default ReportProcess;
