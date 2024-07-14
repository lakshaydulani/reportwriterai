import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import {
  sectionOptions as option,
  aiOptions as options,
} from "../generative/ai-selector-options";
import { useAtom } from "jotai";
import useCompletionJotai from "@/hooks/use-completion-jotai";
import { Button } from "../ui/button";
import { persona } from "@/lib/atom";
import { RefreshCcwDot } from "lucide-react";

const Labels = ({ apiResponse }) => {
  const { completion, complete, isLoading } = useCompletionJotai();
  const [localCompletion, setLocalCompletion] = useState("");
  const [inputPersona, setPersona] = useAtom(persona);
  const [prompt, setPrompt] = useState(() => {
    let basicPrompt = {};
    option.forEach((option) => {
      basicPrompt[option.label] = "";
    });
    return basicPrompt;
  });

  useEffect(() => {
    if (apiResponse) {
      setPrompt((prevPrompt) => ({
        ...prevPrompt,
        detailedobservation: apiResponse,
      }));
    }
  }, [apiResponse]);

  const Commands = (prompt) => {
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

  const handleButtonClick = async (value) => {
    try {
      const payload = {
        prompt: prompt[value],
        persona: inputPersona[value],
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
      setPrompt((prevPrompt) => ({
        ...prevPrompt,
        [value]: data,
      }));
      // setPrompt(data);
    } catch (error) {
      console.error("Error during download:", error);
    }
  };

  const handleChange = (e, key) => {
    setPrompt((prevPrompt) => ({
      ...prevPrompt,
      [key]: e.target.value,
    }));
  };

  return (
    <div>
      <Tabs
        aria-label="Options"
        placement="start"
        className="bg-blue-500 rounded-lg"
      >
        {option.map((item) => {
          return (
            <Tab
              key={item.label}
              title={item.value}
              className="rounded-lg w-full"
            >
              <Card className="bg-white rounded-lg">
                <CardBody>
                  <textarea
                    name={item.value}
                    id={item.label}
                    cols={5}
                    rows={15}
                    defaultValue={prompt[item.label]}
                    onChange={(e) => handleChange(e, item.label)}
                    // placeholder='Enter your prompt'
                  />
                  <button
                    className="absolute top-2 right-2 bg-blue-500 text-white py-1 px-2 rounded-lg"
                    title="Regerate the text"
                    // onClick={() => regenerateText(item.value)}
                  >
                    <RefreshCcwDot />
                  </button>
                  <button
                    className="relative bg-blue-500 text-white py-2 px-4 rounded-lg"
                    onClick={() => handleButtonClick(item.label)}
                  >
                    Generate Text
                  </button>
                </CardBody>
              </Card>
            </Tab>
          );
        })}
      </Tabs>
      <Commands />
      <button
        className="mt-3 bg-ey-yellow hover:bg-yellow-600 flex float-end justify-center items-center text-white font-bold p-2 px-6 rounded-lg disabled:opacity-50"
        // onClick={handleInsert}
        disabled={isLoading}
      >
        Insert
      </button>
    </div>
  );
};

export default Labels;
