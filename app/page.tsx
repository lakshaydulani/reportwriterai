"use client";
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import DownloadReport from "@/components/tailwind/ui/report-process";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import Uploader from "@/components/tailwind/ui/uploader";
import CentralPrompt from "@/components/tailwind/generative/central-prompt";
import { useAtom } from "jotai";
import { atomWithStorage } from 'jotai/utils';
import { useState, useEffect } from 'react';
import { generatedContent, initialContent as initialContentAtom, isEditorLoading as isEditorLoadingAtom, persona, isFirstLoad } from "@/lib/atom";
import { motion, AnimatePresence } from "framer-motion";
import Animation from "@/components/tailwind/ui/animation";
import { Steps } from 'intro.js-react';
import "intro.js/introjs.css";
// import { Skeleton } from "@radix-ui/react-skeleton";


const EditorSkeleton = () => {
  return (
    <div className="bg-white rounded-lg w-full h-[calc(100vh-100px)] p-8">
      <div role="status" className="animate-pulse">
        <div className="h-8 bg-gray-400 dark:bg-gray-700 w-2/3 mb-10"></div>
        <div className="h-5 bg-gray-400 dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
        <div className="h-5 bg-gray-400 dark:bg-gray-700 max-w-[200px] mb-2.5"></div>
        <div className="h-5 bg-gray-400 dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
        <div className="h-5 bg-gray-400 dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
        <div className="h-5 bg-gray-400 dark:bg-gray-700 max-w-[360px] mb-10"></div>
        <div className="h-8 bg-gray-400 dark:bg-gray-700 w-2/3 mb-2"></div>
        <div className="h-5 bg-gray-400 dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
        <div className="h-5 bg-gray-400 dark:bg-gray-700 max-w-[200px] mb-2.5"></div>
        <div className="h-5 bg-gray-400 dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
        <div className="h-5 bg-gray-400 dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
        <div className="h-5 bg-gray-400 dark:bg-gray-700 max-w-[360px]"></div>
      </div>
    </div>
  );
};

export default function Page() {
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
  const [content, setContent] = useAtom(generatedContent);
  const [isEditorLoading, setIsEditorLoadingAtom] = useAtom(isEditorLoadingAtom);
  const [introJS, setIntroJS] = useAtom(isFirstLoad);
  const [inputPersona, setPersona] = useAtom(persona);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("response from route in settings ", data);
        const keys = Object.keys(data);
        const result = data[keys[0]];
        setPersona(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    })();
  }, []);

  const [enabled, setEnabled] = useState(true);
  const [initialStep, setInitialStep] = useState(0);

  const onExit = () => {
    setEnabled(false);
    setIntroJS(false);
  };

  const steps = [
    {
      element: '#first',
      intro: 'This is your AI Editor',
      position: 'right',
    },
    {
      element: '#second',
      intro: 'This is your Functionality Area',
    },
  ];

  return (
    <section>
      <Animation />
      {introJS && (
        <Steps
          enabled={enabled}
          steps={steps}
          initialStep={initialStep}
          onExit={onExit}
        />
      )}
      <div className="grid grid-cols-9 gap-1 px-4">
        <div id="first" className="col-span-5">
          <ScrollArea className="max-h-screen">
            {isEditorLoading ? <EditorSkeleton /> : <TailwindAdvancedEditor />}
          </ScrollArea>
        </div>
        <div id="second" className="col-span-4">
          <div className="p-0 rounded-lg gap-5 flex flex-col [&>section]:border-5 [&>*]:p-3 [&>section]:rounded-lg [&>section]:bg-custom-gradient">
            <CentralPrompt />
          </div>
        </div>
      </div>
    </section>
  );
}
