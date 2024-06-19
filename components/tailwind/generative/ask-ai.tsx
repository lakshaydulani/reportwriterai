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
    });;
  };

  const handleInsert = () => {
    const newContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: localCompletion,
            },
          ],
        },
      ],
    };
    setInitialContent(newContent);
    setContent(newContent);
      setPrompt("");
      setLocalCompletion(""); // Reset local completion state
      setOpen(false); // Close the popover
  };

  return (
    <div className="flex flex-wrap">
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className={`bg-purple-700 editor-button ${isLoading ? 'cursor-not-allowed' : ''}`}
          >
            <Magic className="mr-1 h-4 w-4" />
            Ask AI
          </Button>
        </PopoverTrigger>

        <PopoverContent
          sideOffset={5}
          className="flex max-h-100 w-[35vw] flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl gap-2"
          align="start"
        >
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
            rows={5}
            placeholder="Write with AI.."
          ></textarea>
          {localCompletion.length > 0 && (
            <div className="mt-3 max-h-60 overflow-y-auto p-3 bg-gray-100 rounded-lg">
              <p>{localCompletion}</p>
              <button
                className="mt-3 bg-ey-yellow hover:bg-yellow-600 flex justify-center items-center text-white font-bold p-2 px-6 rounded-lg disabled:opacity-50"
                onClick={handleInsert}
                disabled={isLoading}
              >
                Insert
              </button>
            </div>
          )}
          <button
            className="absolute bottom-3 right-3 bg-violet-700 hover:bg-violet-950 flex justify-center items-center text-white font-bold p-2 px-6 rounded-lg disabled:opacity-50"
            onClick={handleClick}
            disabled={isLoading}
          >
            <SparklesIcon className="mx-2" />
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
