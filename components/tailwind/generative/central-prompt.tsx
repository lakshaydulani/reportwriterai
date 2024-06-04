"use client";
import React, { useEffect, useState } from "react";
import { Settings, SparklesIcon } from "lucide-react";
import {
  generatedContent,
  initialContent as initialContentAtom,
} from "@/lib/atom";
import { toast } from "sonner";
import { useCompletion } from "ai/react";
import { useAtom } from "jotai";
import SectionHeading from "./../ui/section-heading";
// import removeMarkdown from 'remove-markdown';
import { aiOptions as options } from "./ai-selector-options";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/tailwind/ui/popover";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import Popup from "../ui/popup";

const CentralPrompt = () => {
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
  const [prompt, setPrompt] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmitPopup = (inputValue) => {
    console.log('Input value:', inputValue);
    setIsPopupOpen(false);
  };

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

  

  const Commands = () => {
    return (
      <div className="mt-2 mb-4 flex flex-wrap gap-2">
        {options.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant="aihelper"
            onClick={() => handleButtonClick(item.value)}
          >
            <item.icon className="h-4 w-4 mr-2 text-purple-500" />
            {item.label}
          </Button>
        ))}
      </div>
    );
  };

  const getTextFromInitialContent = (initialContent) => {
    if (initialContent && initialContent?.content?.[0]?.content?.[0]?.text) {
      return initialContent.content[0].content[0].text;
    } else if (initialContent?.text) {
      return initialContent.text;
    }else if(initialContent && typeof(initialContent))
      return initialContent;
    return '';
  };

  // Function to handle button clicks
  const handleButtonClick = (value) => {
    const text = getTextFromInitialContent(initialContent);
    complete(text, {
      body: { option: value },
    });
  };

  useEffect(() => {
    if (completion.length > 0) {
      // Remove Markdown to get plain text
      const plainText = completion; //removeMarkdown(completion);
      const newContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: plainText,
              },
            ],
          },
        ],
      };
      setInitialContent(newContent);
      setPrompt("");
    }
  }, [completion]);

  const hasCompletion = completion.length > 0;

  const handleCick = () => {
    if (completion)
      return complete(prompt, {
        body: { option: "zap", command: "generate report" },
      });
    complete(prompt, {
      body: { option: "zap", command: "generate report" },
    });
  };

  return (
    <section className="">
      <div className="flex">
        <SectionHeading>Editor:</SectionHeading>
          <button className="float-end ml-auto" title="Advance Setting" onClick={handleOpenPopup}>
            <Settings />
          </button>
          {isPopupOpen && (
            <Popup onClose={handleClosePopup} onSubmit={handleSubmitPopup} />
          )}
      </div>
      <Commands />
      {/* <hr /> */}
      {/* <Section /> */}
      <hr className="mb-2" />
      <div className="relative w-full">
        <svg
          className="absolute top-3 left-3 w-6 h-6"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect fill="none" height="256" width="256" />
          <line
            fill="none"
            stroke="purple"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            x1="216"
            x2="216"
            y1="128"
            y2="176"
          />
          <line
            fill="none"
            stroke="purple"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            x1="192"
            x2="240"
            y1="152"
            y2="152"
          />
          <line
            fill="none"
            stroke="purple"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            x1="84"
            x2="84"
            y1="40"
            y2="80"
          />
          <line
            fill="none"
            stroke="purple"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            x1="64"
            x2="104"
            y1="60"
            y2="60"
          />
          <line
            fill="none"
            stroke="purple"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            x1="168"
            x2="168"
            y1="184"
            y2="216"
          />
          <line
            fill="none"
            stroke="purple"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            x1="152"
            x2="184"
            y1="200"
            y2="200"
          />
          <rect
            fill="none"
            height="45.25"
            rx="8"
            stroke="purple"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            transform="translate(-53 128) rotate(-45)"
            width="226.3"
            x="14.9"
            y="105.4"
          />
          <line
            fill="none"
            stroke="purple"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            x1="144"
            x2="176"
            y1="80"
            y2="112"
          />
        </svg>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full text-xl p-3 pl-12 rounded-lg"
          rows={2}
          placeholder="Write with AI.."
        ></textarea>

        <button
          className="w-full mt-2 bg-violet-700 hover:bg-violet-950 flex justify-center items-center text-white font-bold p-2 px-6 rounded-lg disabled:opacity-50"
          onClick={handleCick}
          disabled={isLoading}
        >
          <SparklesIcon className="mx-2" />
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
    </section>
  );
};

export default CentralPrompt;
