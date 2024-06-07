"use client";
import React, { useEffect, useState } from "react";
import {
  Atom,
  Bug,
  Settings,
  SparklesIcon,
  AlignJustify,
  FerrisWheel,
  SquareAsterisk,
  Check,
  ChevronDown,
  Heading,
  Boxes,
} from "lucide-react";
import {
  generatedContent,
  initialContent as initialContentAtom,
  persona,
  isEYFontRequired,
} from "@/lib/atom";
import { toast } from "sonner";
import { useCompletion } from "ai/react";
import { useAtom } from "jotai";
import SectionHeading from "./../ui/section-heading";
import { aiOptions as options } from "./ai-selector-options";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/tailwind/ui/popover";
import Link from "next/link";
import Image from "next/image";
import Popup from "../ui/popup";

const CentralPrompt = () => {
  const [content, setContent] = useAtom(generatedContent);
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
  const [prompt, setPrompt] = useState("");
  const [sectionPrompt, setSectionPrompt] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmitPopup = (inputValue) => {
    console.log("Input value:", inputValue);
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
    } else if (initialContent && typeof initialContent) return initialContent;
    return "";
  };

  // Function to handle button clicks
  const handleButtonClick = (value) => {
    const text = getTextFromInitialContent(content);
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
      setContent(newContent);
      setInitialContent(newContent);
      setPrompt("");
    }
  }, [completion]);

  const hasCompletion = completion.length > 0;

  const handleCick = () => {
    console.log("persona is ", persona.init);
    if (completion)
      return complete(prompt, {
        body: { option: "zap", command: persona.init },
      });
    complete(prompt, {
      body: { option: "zap", command: persona.init },
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
      <div className="my-3 flex flex-wrap gap-1">
        <Popover modal={true} open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              size="lg"
              className="gap-2 rounded-xl w-full"
              variant="default"
            >
              <span className="rounded-sm px-1">Add Section</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            sideOffset={5}
            className="flex max-h-100 w-full flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl "
            align="start"
          >
            {option.map((item) => {
              return (
                <div className="my-1 px-2 text-sm font-semibold">
                  <Button
                    onClick={appendSection(item.lable)}
                    size="sm"
                    className="rounded-xl w-full border-black"
                    variant="outline"
                  >
                    <item.icon className="float-left" />
                    {item.lable}
                  </Button>
                </div>
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
      <hr />
      <div className="relative w-full">
        <Boxes className="absolute top-5 left-3 w-6 h-6 color" />
        <textarea
          value={sectionPrompt}
          onChange={(e) => setSectionPrompt(e.target.value)}
          className="w-full text-xl p-3 pl-12 rounded-lg mt-2"
          rows={7}
          placeholder="Enter your IA observation"
        ></textarea>
        <Section />
      </div>
      <hr className="mb-2" />
      <div className="relative w-full">
        <Image
          alt="AI icon"
          src="images/ailogo.svg"
          className="absolute top-3 left-3 w-6 h-6"
          width={50}
          height={50}
        />

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full text-xl p-3 pl-12 rounded-lg"
          rows={4}
          placeholder="Write with AI.."
        ></textarea>

        <button
          className="absolute bottom-3 right-3 bg-violet-700 hover:bg-violet-950 flex justify-center items-center text-white font-bold p-2 px-6 rounded-lg disabled:opacity-50"
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
