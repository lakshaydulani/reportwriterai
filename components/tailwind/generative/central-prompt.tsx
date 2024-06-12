"use client";
import React, { useEffect, useState } from "react";
import {
  Atom,
  Bug,
  Settings2 as Settings,
  FerrisWheel,
  SquareAsterisk,
  Check,
  ChevronDown,
  Heading,
  Pen as PencilLine,
  FileUp,
} from "lucide-react";
import {
  generatedContent,
  initialContent as initialContentAtom,
  persona,
  isEYFontRequired,
} from "@/lib/atom";

import { useCompletion } from "ai/react";
import useCompletionJotai from "@/hooks/use-completion-jotai";
import { useAtom } from "jotai";
import SectionHeading from "./../ui/section-heading";
import { aiOptions as options } from "./ai-selector-options";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/tailwind/ui/popover";
import Popup from "@/components/tailwind/ui/popup";
import { Separator } from "@/components/tailwind/ui/separator";
import DownloadReport from "@/components/tailwind/ui/report-process";

import dynamic from 'next/dynamic';

const Observations = dynamic(() => import('@/components/tailwind/ui/observation'), {
  ssr: false,
});

const CentralPrompt = () => {
  const [content, setContent] = useAtom(generatedContent);
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
  const [sectionPrompt, setSectionPrompt] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmitPopup = (inputValue) => {
    setIsPopupOpen(false);
  };

  const { completion, complete, isLoading } =
    useCompletionJotai();


  const Commands = () => {
    return (
      <div className="mt-2 mb-4 flex flex-wrap gap-2">
        {options.map((item) => (
          <Button
            key={item.value}
            size="aihelper"
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
    } else if (initialContent && typeof initialContent) return initialContent;
    return "";
  };

  // Function to handle button clicks
  const handleButtonClick = (value) => {
    const text = getTextFromInitialContent(content);
    complete(text, {
      body: { option: value },
    }).then((data) => {
      const newContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: data,
              },
            ],
          },
        ],
      };
      setContent(newContent);
      setInitialContent(newContent);
    });
  };

  const Section = () => {
    const [open, onOpenChange] = useState(false);

    const mergeContent = (initial: any, additional: any): any => {
      return {
        ...initial,
        content: [...initial.content, ...additional.content],
      };
    };

    const appendSection = (value) => () => {
      const newContent = {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [
              {
                type: "text",
                text: value,
              },
            ],
          },
        ],
      };
      const newInitialContent = { ...initialContent, ...content };
      const newObject = mergeContent(newInitialContent, newContent);
      setInitialContent(newObject);
      setContent(newObject);
      onOpenChange(false);
    };

    const option = [
      {
        lable: "Header",
        icon: Heading,
      },
      {
        lable: "Background",
        icon: Atom,
      },
      {
        lable: "Issue Summary",
        icon: Bug,
      },
      {
        lable: "Detailed observation",
        icon: FerrisWheel,
      },
      {
        lable: "Risk/ Impact",
        icon: SquareAsterisk,
      },
      {
        lable: "Root cause",
        icon: SquareAsterisk,
      },
      {
        lable: "Recommendation",
        icon: SquareAsterisk,
      },
      {
        lable: "Management Comment",
        icon: SquareAsterisk,
      },
    ];
    return (
      <div className="my-3 flex flex-wrap">
        <Popover modal={true} open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button size="lg" className="rounded-xl w-full" variant="default">
              <span className="rounded-sm px-1">Add Section</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            sideOffset={5}
            className="flex max-h-100 w-[35vw] flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl gap-2 "
            align="start"
          >
            {option.map((item) => {
              return (
                <Button
                  onClick={appendSection(item.lable)}
                  variant="outline"
                  className="rounded-xl w-full border-black"
                >
                  <item.icon className="float-left mr-auto" />
                  {item.lable}
                </Button>
              );
            })}
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <section className="">
      <div className="flex">
        <SectionHeading>Editor:</SectionHeading>
        <button
          className="float-end ml-auto"
          title="Advance Setting"
          onClick={handleOpenPopup}
        >
          <Settings />
        </button>
        {isPopupOpen && (
          <Popup onClose={handleClosePopup} onSubmit={handleSubmitPopup} />
        )}
      </div>
      <Commands />
      <Separator orientation="horizontal" />
      <div className="relative w-full">
        <PencilLine className="absolute top-5 left-3 w-6 h-6 color" />
        <textarea
          value={sectionPrompt}
          onChange={(e) => setSectionPrompt(e.target.value)}
          className="w-full text-xl p-3 pl-12 rounded-lg mt-2"
          rows={7}
          placeholder="Enter your IA observation"
        ></textarea>
        <Section />
      </div>

      <Separator orientation="horizontal" />
      <Observations />      
      
      <Separator orientation="horizontal" />
      <DownloadReport />
    </section>
  );
};

export default CentralPrompt;
