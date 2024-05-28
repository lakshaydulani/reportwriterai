import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
// import { Button } from "@/components/tailwind/ui/button";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
// import Menu from "@/components/tailwind/ui/menu";
import ReportProcess from "@/components/tailwind/ui/report-process";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
// import Link from "next/link";
import Uploader from "@/components/tailwind/ui/uploader";
import Header from "@/components/tailwind/ui/header";
import CentralPrompt from "@/components/tailwind/generative/central-prompt";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col gap-4 py-2 sm:px-5 bg-zinc-200">
      {/* 
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml gap-2">
              <BookOpen className="h-4 w-4" />
              Usage in dialog
            </Button>
          </DialogTrigger>
          <DialogContent className="flex max-w-3xl h-[calc(100vh-24px)]">
                        
          </DialogContent>
        </Dialog>
        <Link href="/docs" className="ml-auto">
          <Button variant="ghost">Documentation</Button>
        </Link>*/}


      <Header />
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-5">
          <ScrollArea className="max-h-screen">
            <TailwindAdvancedEditor />
          </ScrollArea>
        </div>
        <div className="col-span-2">
          <Uploader />
          <ReportProcess />
          <Link
            href='/knowledgebase'
          >
            <button className="bg-black mt-5 p-5 rounded-full text-white">Knowledge Base</button>
          </Link>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-16 bg-zinc-200 shadow-lg">
        <CentralPrompt />
      </div>


    </div>
  );
}
