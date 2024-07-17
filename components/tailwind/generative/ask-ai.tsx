"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import useCompletionJotai from "@/hooks/use-completion-jotai";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { generatedContent, initialContent as initialContentAtom, persona, isEYFontRequired } from "@/lib/atom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
import { SparklesIcon, Atom, Stamp, BookOpen, ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import Magic from "../ui/icons/magic";
import { createParagraph } from "@/app/utils/editor-utils";
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2156026760.
import { aiOptions as options, sectionOptions as option } from "./ai-selector-options";
import Labels from "../ui/tabs";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { Separator } from "@/components/tailwind/ui/separator";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

const isDisabled = false;

export const AskAI = ({ setInitialContent, setContent }) => {
  const [prompt, setPrompt] = useState("");
  const [open, setOpen] = useState(false);
  const [localCompletion, setLocalCompletion] = useState("");
  const [generatePersona, setGeneratePersona] = useState("You are an AI assistant chat bot who gives response according to EY Standrads and response limit should be 500 words and at the end of the response you should give copywrite by EY.");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [inputPersona, setPersona] = useAtom(persona);

  const { completion, complete, isLoading } = useCompletionJotai();

  useEffect(()=>{

  },[apiResponse]);

  const handleClick = async () => {
    setLoading(true);
    try {
        const payload = {
            prompt: prompt,
            persona: inputPersona['detailedobservation']
        };

        const res = await fetch("/api/langchain", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        const data = await res.json();
        setApiResponse(data);
    } catch (error) {
        console.error("Error is occurred:", error);
    }
    setLoading(false)
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

  const Commands = (prompt) => {
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
      complete(prompt, {
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.1,
        ease: [0, 0.71, 0.2, 1.01]
      }}
    >
      <strong>Kick off your observation by sharing:</strong>
      <Separator orientation="horizontal" className="my-2"/>
      <div className="p-4 bg-white rounded-lg shadow-lg">
          <strong>
            <div className="flex my-2">
              <Atom className="mr-2"/>
              <span data-tooltip-id="my-tooltip">The context behind it</span>
            </div>
            <div className="flex my-2">
              <Stamp className="mr-2"/>
              <span>The Principle you're measuring against</span>
            </div>
            <div className="flex my-2">
              <BookOpen className="mr-2"/>
              <span>In-depth insights from your findings</span>
            </div>
            <div className="flex my-2">
              <ShieldAlert className="mr-2"/>
              <span>Anything else you deem important to include</span>
            </div>
          </strong>
        <Tooltip id="my-tooltip" place="left">
          Background
        </Tooltip>
      </div>
      <div className="bg-blue-500 text-center rounded-lg m-4 p-2 w-1/2 mx-auto flex justify-center">
        <button>
          Download E.g.
        </button>
      </div>

      <div className="flex justify-center m-2">
        <i><strong>Jumpstart your work with our recommended templates!</strong></i>
      </div>

      <div className="bg-blue-500 text-center rounded-lg m-4 p-2 w-1/2 mx-auto flex justify-center">
        <button>
          Download template
        </button>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-lg">
      
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
          disabled={loading}
        >
          <SparklesIcon className="mx-2" />
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      </div>
      <Separator className="my-2" orientation="horizontal" />
      {apiResponse.length > 0 && (
        <div className="w-full my-2">
          <Labels apiResponse = {apiResponse}/>
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
    </motion.div>
  );
};


