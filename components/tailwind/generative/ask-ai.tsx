"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import useCompletionJotai from "@/hooks/use-completion-jotai";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { generatedContent, initialContent as initialContentAtom, persona, isEYFontRequired } from "@/lib/atom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
import { SparklesIcon } from "lucide-react";
import { Button } from "../ui/button";
import Magic from "../ui/icons/magic";
import { createParagraph } from "@/app/utils/editor-utils";
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2156026760.
import { aiOptions as options, sectionOptions as option } from "./ai-selector-options";
import Labels from "../ui/tabs";

const isDisabled = false;

export const AskAI = ({ setInitialContent, setContent }) => {
  const [prompt, setPrompt] = useState("");
  const [open, setOpen] = useState(false);
  const [localCompletion, setLocalCompletion] = useState("");

  const { completion, complete, isLoading } = useCompletionJotai();

  const handleClick = () => {
    complete(prompt, {
      body: { option: "zap", command: persona.init },
    }).then((data) => {
      setLocalCompletion(data);
    });
  };

  const handleInsert = () => {
    const newContent = createParagraph(localCompletion);
    setInitialContent(newContent);
    setContent(newContent);
    clearAskAIPopup(setPrompt, setLocalCompletion, setOpen); // Close the popover 
  };

  const clearAskAIPopup = (setPrompt: React.Dispatch<React.SetStateAction<string>>, setLocalCompletion: React.Dispatch<React.SetStateAction<string>>, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    setPrompt("");
    setLocalCompletion(""); // Reset local completion state
    setOpen(false);
  }

  const Commands = () => {
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

    const handleButtonClick = (value) => {
      // const text = getTextFromInitialContent(content);
      complete(localCompletion, {
        body: { option: value },
      }).then((data) => {
        setLocalCompletion(data);
      });
    };
    return (
      <div className="mt-2 mb-4 flex flex-wrap gap-2">
        {options.map((item) => (
          <Button
            key={item.value}
            size="aihelper"
            variant="aihelper"
            onClick={() => handleButtonClick(item.value)}
            // disabled={isDisabled} // Disable button if content or initialContent is empty
          >
            <item.icon className="h-4 w-4 mr-2 text-purple-500" />
            {item.label}
          </Button>
        ))}
      </div>
    );
  };



  return (
    <div className="">
      <strong className='text-center mb-4'>To start drafting your observation please provide:</strong>
      <ol className='list-decimal list-inside'>
        <li><u>Background of the observation</u></li>
        <li><u>Principle against which you are evaluating</u></li>
        <li><u>Detailed findings of your observation</u></li>
        <li><u>Any other matter you think should be included</u></li>
      </ol>
      {/* <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild> */}
          {/* <Button
            className={`bg-purple-700 editor-button ${
              isLoading ? "cursor-not-allowed" : ""
            }`}
          >
            
            Ask AI
          </Button> */}
        {/* </PopoverTrigger> */}

        {/* <PopoverContent
          sideOffset={5}
          className="flex max-h-100 w-[35vw] flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl gap-2"
          align="start"
        > */}
        <div className="relative mt-5">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full text-xl p-3 pl-12 rounded-lg border-black border"
            rows={5}
            placeholder="Please Enter your draft audit observation"
            >
          </textarea>
            <Image
              alt="AI icon"
              src="images/ailogo.svg"
              className="absolute top-2 left-3 w-6 h-6 my-2"
              width={50}
              height={50}
              />
              </div>
            <div className="w-full flex justify-center items-center">

          <button
            className="w-full my-2 bottom-3 right-3 bg-violet-700 hover:bg-violet-950 flex justify-center items-center text-white font-bold p-2 px-6 rounded-lg disabled:opacity-50"
            onClick={handleClick}
            disabled={isLoading}
            >
            <SparklesIcon className="mx-2" />
            {isLoading ? "Generating..." : "Generate"}
          </button>
            </div>
          {localCompletion.length > 0 && (
            <div className="w-full">
              <Labels />
            </div>
            
            // <div>
            //   <div className="mt-3 max-h-60 overflow-y-auto p-3 bg-gray-100 rounded-lg border border-pink-500">
            //     <p>{localCompletion}</p>
            //   </div>
              
            //   <Commands />
            //   <button
            //     className="mt-3 bg-ey-yellow hover:bg-yellow-600 flex justify-center items-center text-white font-bold p-2 px-6 rounded-lg disabled:opacity-50"
            //     onClick={handleInsert}
            //     disabled={isLoading}
            //   >
            //     Insert
            //   </button>
            // </div>
          )}
        {/* </PopoverContent>
      </Popover> */}
    </div>
  );
};


