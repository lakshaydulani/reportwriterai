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
} from "@/lib/atom";
import { motion, AnimatePresence } from "framer-motion";
import Animation from "@/components/tailwind/ui/animation";
export default function Page() {
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);
  const [content, setContent] = useAtom(generatedContent);
  // const [welcomeScreenVisible, setWelcomeScreenVisible] = useState(true);

  return (
    <section>
      <Animation />
      {/* style={{ opacity: welcomeScreenVisible ? 0 : 1, transition: 'opacity 1s' }} */}
      
      <div className="grid grid-cols-8 gap-3 px-4">
        
        <div className="col-span-3">
          <div className="p-0 rounded-lg gap-5 flex flex-col [&>section]:border-5 [&>*]:p-3 [&>section]:rounded-lg [&>section]:bg-custom-gradient">
            {/* <Uploader /> */}
            <CentralPrompt />
            {/* <ReportProcess /> */}
          </div>
        </div>
        <div className="col-span-5">
          <ScrollArea className="max-h-screen">
            <TailwindAdvancedEditor />
          </ScrollArea>
          {/* content - <br />
          {JSON.stringify(content)}
          <br />
          initial content - <br />
          {JSON.stringify(initialContent)} */}
        </div>
      </div>
    </section>
  );
}
