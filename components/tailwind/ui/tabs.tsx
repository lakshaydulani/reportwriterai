import React, { useEffect, useState, useRef } from "react";
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

// Suggested code may be subject to a license. Learn more: ~LicenseLog:2889041356.
const Labels = ({ apiResponse, handleCallback }) => {
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

  const textareaRef = useRef(null);

  useEffect(() => {
    if (apiResponse) {
      setPrompt((prevPrompt) => ({
        ...prevPrompt,
        detailedobservation: apiResponse,
      }));
    }
  }, [apiResponse]);

  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, [selectedKey, prompt[selectedKey]]); // Adjust dependency array as needed

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

  const handleButtonClick = async (label, index) => {
    console.log(prompt[label]);
    try {
      let str = "";
      option.slice(0, index+1).forEach((item) => {
        str += prompt[item.label];
      });
      const payload = {
        prompt: str,
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
      <div className="v0">
        <button className="v1 w-full flex wrap justify-between items-center" title="Your Prompt is Empty">
          <span>{value}</span>
          <ShieldAlert className="float-end"/>
        </button>
      </div>
      )
    }
    return (
      <div>
        {value}
      </div>
     )
  }

  const handleInsert = () => {
    console.log(prompt);
    const generateEditorContent = () => {
      const content = [];
    
      Object.keys(prompt).forEach((key) => {
        // Add heading
        content.push({
          type: "heading",
          attrs: { level: 2 }, // Define heading level as needed
          content: [
            {
              type: "text",
              text: options.find((option) => option.label === key)?.value || key,
            },
          ],
        });
    
        // Add paragraph with prompt value
        content.push({
          type: "paragraph",
          content: [
            {
              type: "text",
              text: prompt[key] || "Add your text here...",
            },
          ],
        });
      });
    
      return {
        type: "doc",
        content: content,
      };
    };
    let xyz = generateEditorContent()
    handleCallback(xyz);
  }

  return (
    <div>
      <Tabs aria-label="Options" placement="start" className="rounded-lg" onSelectionChange={(key) => handleTabChange(key)}>
        {option.map((item, index ) => (
          <Tab key={item.label} title={handleDisplayButton(item.label, item.value)} className="v3 bg-black text-white w-full">
            <Card className="v4 bg-white rounded-lg">
              <CardBody className="v2">
                <textarea
                  ref={textareaRef}
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
                  onClick={() => handleButtonClick(item.label, index)}
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
