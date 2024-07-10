import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import { sectionOptions as option, aiOptions as options } from '../generative/ai-selector-options';
import useCompletionJotai from "@/hooks/use-completion-jotai";
import { Button } from "../ui/button";

const Labels = ({apiResponse}) => {
  const { completion, complete, isLoading } = useCompletionJotai();
  const [localCompletion, setLocalCompletion] = useState("");

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
      const res = await fetch("/api/langchain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
    } catch (error) {
      console.error("Error during download:", error);
    }
  };
  return (
    <div>
    <Tabs aria-label="Options" placement='start' className="bg-purple-500 rounded-lg">
      {option.map((item) => {
        return (
          <Tab key={item.label} title={item.value} className="rounded-lg w-full" onClick={() => handleButtonClick(item.label)}>
            <Card className="bg-white rounded-lg">
              <CardBody>
                <textarea
                  name={item.value}
                  id={item.label}
                  cols={5}
                  rows={15}
                  value={item.label === 'detailedobservation' ? apiResponse : ''}
                  // defaultValue={`This is a textarea for ${item.label}`}
                />
              </CardBody>
            </Card>
          </Tab>
        );
      })}
    </Tabs>
    <Commands />
    </div>
  );
};

export default Labels;
