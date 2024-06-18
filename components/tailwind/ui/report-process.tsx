"use client";
import React from "react";
import { useState } from "react";
import { DownloadIcon, SendIcon as MailIcon, SparklesIcon } from "lucide-react";
import { useAtom } from "jotai";
import {
  initialContent as initialContentAtom,
  generatedContent,
  contentArray
} from "@/lib/atom";
import { saveAs } from "file-saver";

const DownloadReport = () => {
  const [isLoad, setIsLoading] = useState(false);
  const [content, setContent] = useAtom(generatedContent);
  const [contentArrayElement, setContentArrayElement] = useAtom(contentArray);

  const handleDownloadClick = async () => {
    setIsLoading(true);
    let Payload = [];
    if(contentArrayElement.length === 0){
      Payload = [content];
    }
    else{
      Payload = contentArrayElement;
    }
    try {
      const res = await fetch("/api/download-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Payload),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      const base64URL =
        "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
        data.file;
      try {
        const base64String = base64URL.split(",")[1];
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        saveAs(blob, "downloaded_file.docx");
      } catch (error) {
        console.error("Error downloading the file:", error);
      }
    } catch (error) {
      console.error("Error during download:", error);
    }
    setIsLoading(false);
  };
  return (   

      <button
        className="mt-4 text-xl bg-ey-yellow border border-2 border-black flex w-full justify-center items-center font-bold py-4 px-6 rounded-lg ${
            isLoad ? 'cursor-not-allowed' : ''
          }`"
        onClick={handleDownloadClick}
        disabled={isLoad}
      >
        <DownloadIcon className="mr-auto" />
        {isLoad ? "Downloading..." : "Download Report"}
      </button>
  );
};

export default DownloadReport;
