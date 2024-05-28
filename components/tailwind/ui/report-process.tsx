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

  const generateReport = () => {
    console.log({ completion, complete }, "<<<");
    if (completion) {
      const result = complete(completion, {
        body: { option: "generate", command: prompt },
      });
      console.log(result);
    }
  };

  return (
    <section>
      <SectionHeading>Generate Report as per EY Guidelines:</SectionHeading>
      <button className="bg-sky-600 flex w-full justify-center items-center text-white font-bold py-4 px-8 rounded-lg">
        <DownloadIcon className="mx-2" />
        Download
      </button>
    </section>
  );
};

export default ReportProcess;
