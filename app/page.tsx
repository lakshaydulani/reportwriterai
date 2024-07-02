"use client";
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import DownloadReport from "@/components/tailwind/ui/report-process";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import Uploader from "@/components/tailwind/ui/uploader";
import CentralPrompt from "@/components/tailwind/generative/central-prompt";
import { useAtom } from "jotai";
import { useState } from 'react';
import {
  generatedContent,
  initialContent as initialContentAtom,
  isEditorLoading as isEditorLoadingAtom
} from "@/lib/atom";
import { motion, AnimatePresence } from "framer-motion";
import Animation from "@/components/tailwind/ui/animation";
// import { Skeleton } from "@radix-ui/react-skeleton";


const EditorSkeleton = () => {
  return (<div className="bg-white rounded-lg w-full h-[calc(100vh-100px)] p-8">
    <div role="status" className="animate-pulse">
    <div className="h-8 bg-gray-400 dark:bg-gray-700 w-2/3 mb-10"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[200px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[360px] mb-10"></div>
    <div className="h-8 bg-gray-400 dark:bg-gray-700 w-2/3 mb-2"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[200px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
    <div className="h-5 bg-gray-400  dark:bg-gray-700 max-w-[360px]"></div>
</div>
  </div>);
}


export default function Page() {
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
  const [content, setContent] = useAtom(generatedContent);
  const [isEditorLoading, setIsEditorLoadingAtom] = useAtom(isEditorLoadingAtom);
  // const [welcomeScreenVisible, setWelcomeScreenVisible] = useState(true);

  return (
    <section>
      <Animation />
      
      <div className="grid grid-cols-9 gap-3 px-4">        
        <div className="col-span-5">
          <ScrollArea className="max-h-screen">
            {isEditorLoading ? <EditorSkeleton/> : <TailwindAdvancedEditor />}            
          </ScrollArea>
          {/* content - <br />
          {JSON.stringify(content)}
          <br />
          initial content - <br />
          {JSON.stringify(initialContent)} */}
        </div>
        <div className="col-span-4">
          <div className="p-0 rounded-lg gap-5 flex flex-col [&>section]:border-5 [&>*]:p-3 [&>section]:rounded-lg [&>section]:bg-custom-gradient">
            <CentralPrompt />
          </div>
        </div>
      </div>
    </section>
  );
}
