"use client";
import React from "react";
import { DownloadIcon, SendIcon as MailIcon, SparklesIcon } from "lucide-react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import SectionHeading from "./section-heading";
import { useAtom } from "jotai";
import {
  initialContent as initialContentAtom,
} from "@/lib/atom";


const ReportProcess = () => {
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
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
    try {
        const res = await fetch("/api/download-file", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: getTextFromInitialContent(initialContent) }),
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Response of Download api: ", data);
    } catch (error) {
        console.error("Error during download:", error);
    }
};
  return (
    <section>
      <SectionHeading helptext="Formatted as per EY Guidelines">Generate Report:</SectionHeading>
      <button className="bg-ey-yellow flex w-full justify-center items-center font-bold py-4 px-8 rounded-lg"
              onClick={handleDownloadClick}
      >
        <DownloadIcon className="mx-2"/>
        Download
      </button>
    </section>
  );
};

export default ReportProcess;
