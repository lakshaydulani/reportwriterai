import React from 'react';
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import { sectionOptions as option } from '../generative/ai-selector-options';

const Labels = () => {
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
    // <div className="flex flex-wrap flex-col">
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
                  defaultValue={`This is a textarea for ${item.label}`}
                />
              </CardBody>
            </Card>
          </Tab>
        );
      })}
    </Tabs>
    // </div>
  );
};

export default Labels;
