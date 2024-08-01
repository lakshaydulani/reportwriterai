import React, { useEffect, useState } from "react";
import "@/styles/globals.css";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import {
  sectionOptions as option,
  aiOptions as options,
} from "../generative/ai-selector-options";
import { useAtom } from "jotai";
import useCompletionJotai from "@/hooks/use-completion-jotai";
import { Button } from "../ui/button";
import { RefreshCcwDot, ShieldAlert } from "lucide-react";
import { generatedContent, initialContent as initialContentAtom, persona, isEYFontRequired } from "@/lib/atom";

const Labels = ({ apiResponse }) => {
  const { completion, complete, isLoading } = useCompletionJotai();
  const [localCompletion, setLocalCompletion] = useState("");
  const [inputPersona, setPersona] = useAtom(persona);
  const [content, setContent] = useAtom(generatedContent);
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
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
      complete(prompt[selectedKey], {
        body: { option: value },
      }).then((data) => {
        setPrompt((prevPrompt) => ({
          ...prevPrompt,
          [selectedKey]: data,
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

  const handleInsert = () => {
    const result = Object.values(prompt).join("\n")
    const obj = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        },
      ]
    }
    setContent(obj)
    setInitialContent(obj)
  }

  const handleDisplayButton = (key,value) => {
    if (prompt[key] === "") {
      return (
        <button className="flex wrap justify-between items-center" title="Your Prompt is Empty">
          <span>{value}</span>
          <ShieldAlert className="float-end"/>
        </button>
      )
    }
    return (
      <div>
        {value}
      </div>
     )
  }

  return (
    <div>
      <Tabs aria-label="Options" placement="start" className="rounded-lg" onSelectionChange={(key) => handleTabChange(key)}>
        {option.map((item) => (
          <Tab key={item.label} title={handleDisplayButton(item.label, item.value)} className="v3 bg-custom-gradient-tabs rounded-lg w-full">
            <Card className="v4 bg-white rounded-lg">
              <CardBody className="v2">
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
                  className="absolute bottom-2 right-2 bg-blue-500 text-white py-1 px-2 rounded-lg"
                  title="Generate/Regenerate the text"
                  onClick={() => handleButtonClick(item.label)}
                >
                  <RefreshCcwDot />
                </button>
              </CardBody>
            </Card>
          </Tab>
        ))}
      </Tabs>
      <Commands />
      <button
        className="mt-3 bg-ey-yellow hover:bg-yellow-600 flex float-end justify-center items-center text-white font-bold p-2 px-6 rounded-lg disabled:opacity-50"
        onClick={handleInsert}
        disabled={isLoading}
      >
        Insert
      </button>
    </div>
  );
};

export default Labels;
