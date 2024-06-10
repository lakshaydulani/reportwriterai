"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import {
    generatedContent,
    initialContent as initialContentAtom,
    persona,
    isEYFontRequired,
  } from "@/lib/atom";
  import { SparklesIcon } from "lucide-react";

const AskAI = () => {

    const [prompt, setPrompt] = useState("");

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

    const hasCompletion = completion.length > 0;

    const handleClick = () => {
      console.log("persona is ", persona.init);
      if (completion)
        return complete(prompt, {
          body: { option: "zap", command: persona.init },
        });
      complete(prompt, {
        body: { option: "zap", command: persona.init },
      });
    };
    return (<>
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
          onClick={handleClick}
          disabled={isLoading}
        >
          <SparklesIcon className="mx-2" />
          {isLoading ? "Generating..." : "Generate"}
        </button>
    </>)
}