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
  const [selectedKey, setSelectedKey] = useState('detailedobservation');
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

  const Commands = () => {
    const handleButtonClick = (value) => {
      // const text = getTextFromInitialContent(content);
      complete(prompt[selectedKey], {
        body: { option: value },
      }).then((data) => {
        setPrompt((prevPrompt) => ({
          ...prevPrompt,
          selectedKey: data,
        }));;
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

  const handleButtonClick = async (label) => {
    console.log(prompt[label]);
    try {
      const payload = {
        prompt: prompt[label],
        persona: inputPersona[label],
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
        [label]: data,
      }));
    } catch (error) {
      console.error("Error during download:", error);
    }
  };
  

  const handleChange = (e, label) => {
    const { value } = e.target;
    setPrompt((prevPrompt) => ({
      ...prevPrompt,
      [label]: value,
    }));
  };

  const handleTabChange = (key) => {
    // console.log("prompt key is ",prompt[key]);
    setSelectedKey(key);
  }
  

  return (
    <div>
      <Tabs aria-label="Options" placement="start" className="bg-blue-500 rounded-lg"  onSelectionChange={(key)=>handleTabChange(key)}>
  {option.map((item) => (
    <Tab key={item.label} title={item.value} className="rounded-lg w-full">
      <Card className="bg-white rounded-lg">
        <CardBody>
          <textarea
            name={item.value}
            id={item.label}
            cols={5}
            rows={15}
            value={prompt[item.label]}
            onChange={(e) => handleChange(e, item.label)}
            placeholder={`Enter your prompt for ${item.value}`}
          />
          <button
            className="absolute top-2 right-2 bg-blue-500 text-white py-1 px-2 rounded-lg"
            title="Regenerate the text"
            onClick={() => handleButtonClick(item.label)}
          >
            <RefreshCcwDot />
          </button>
          <button
            className="relative bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => handleButtonClick(item.label)}
          >
            {prompt[item.label]===""? "Generate Response" : "Regerate Response"}
          </button>
        </CardBody>
      </Card>
    </Tab>
  ))}
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
