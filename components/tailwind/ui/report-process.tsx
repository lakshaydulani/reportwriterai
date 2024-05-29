"use client";
import React from "react";
import { DownloadIcon, SendIcon as MailIcon, SparklesIcon } from "lucide-react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import SectionHeading from "./section-heading";

const ReportProcess = () => {
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

  return (
    <section>
      <SectionHeading helptext="Formatted as per EY Guidelines">Generate Report:</SectionHeading>
      <button className="bg-ey-yellow flex w-full justify-center items-center font-bold py-4 px-8 rounded-lg">
        <DownloadIcon className="mx-2" />
        Download
      </button>
    </section>
  );
};

export default ReportProcess;
