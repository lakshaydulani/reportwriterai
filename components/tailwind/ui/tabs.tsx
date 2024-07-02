import React from 'react';
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import { sectionOptions as option } from '../generative/ai-selector-options';

const Labels = () => {
  return (
    // <div className="flex flex-wrap flex-col">
      <Tabs aria-label="Options" placement='start' className="bg-purple-500 rounded-lg">
        {option.map((item) => {
          return (
            <Tab key={item.label} title={item.value} className="rounded-lg w-full">
              <Card className="bg-white rounded-lg">
                <CardBody>
                  <textarea
                    name={item.value}
                    id={item.label}
                    cols={5}
                    rows={15}
                    defaultValue={`This is a textarea for ${item.label}`}
                    className=""
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
