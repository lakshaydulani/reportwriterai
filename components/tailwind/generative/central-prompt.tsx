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
  Zap,
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
import { aiOptions as options, sectionOptions as option } from "./ai-selector-options";
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
  const [isDisabled, setIsDisabled] = useState(true);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmitPopup = (inputValue) => {
    setIsPopupOpen(false);
  };

  const { completion, complete, isLoading } = useCompletionJotai();

  const isContentEmpty = (content) => {
    return (
      content &&
      content.type === "doc" &&
      content.content &&
      content.content.length === 1 &&
      content.content[0].type === "paragraph" &&
      !content.content[0].content
    );
  };

  useEffect(() => {
    const checkIfDisabled = () => {
      if (isContentEmpty(content) || isContentEmpty(initialContent)) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    };
    checkIfDisabled();
  }, [content, initialContent]);

  const Commands = () => {
    return (
      <div className="mt-2 mb-4 flex flex-wrap gap-2">
        {options.map((item) => (
          <Button
            key={item.value}
            size="aihelper"
            variant="aihelper"
            onClick={() => handleButtonClick(item.value)}
            disabled={isDisabled} // Disable button if content or initialContent is empty
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
    } else if (initialContent && typeof initialContent === 'string') {
      return initialContent;
    }
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

    const mergeContent = (initial, additional) => {
      return {
        ...initial,
        content: [...initial.content, ...additional.content],
      };
    };
    

    const appendSection = (value) => () => {
      // make changes here to integrate api from DB
      complete(sectionPrompt, {
        body: { option: "zap", command:"You are an auditor tasked with presenting a report for an internal audit. Your role is to clearly lay out the background of the operation under scrutiny and present your observations based on the following evidence collected" },
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
      }
      );
      // const newInitialContent = { ...initialContent, ...content };
      // const newObject = mergeContent(newInitialContent, newContent);
      // setInitialContent(newObject);
      // setContent(newObject);
      onOpenChange(false);
    };

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
                  onClick={appendSection(item.value)}
                  variant="outline"
                  className="rounded-xl w-full border-black"
                >
                  <item.icon className="float-left mr-auto" />
                  {item.value}
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
