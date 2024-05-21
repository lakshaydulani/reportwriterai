import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
import Menu from "@/components/tailwind/ui/menu";
import ReportProcess from "@/components/tailwind/ui/report-process";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { UploadIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col gap-4 py-4 sm:px-5 bg-zinc-200">
      {/* <div className="flex w-full max-w-screen-lg items-center gap-2 px-4">
        <Button size="icon" variant="outline">
          <a href="https://github.com/steven-tey/novel" target="_blank" rel="noreferrer">
            <GithubIcon />
          </a>
        </Button> 
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml gap-2">
              <BookOpen className="h-4 w-4" />
              Usage in dialog
            </Button>
          </DialogTrigger>
          <DialogContent className="flex max-w-3xl h-[calc(100vh-24px)]">
            <ScrollArea className="max-h-screen">
              <TailwindAdvancedEditor />
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Link href="/docs" className="ml-auto">
          <Button variant="ghost">Documentation</Button>
        </Link>
               
      </div>*/}


      <div className="flex w-full">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/EY_logo_2019.svg/1200px-EY_logo_2019.svg.png" alt="EY Logo" className="h-9 w-auto mr-8" />
        <h1 className="text-3xl font-bold mb-4">EY AI Report Writer</h1>
        <div className="ml-auto"><Menu /></div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-5">
          <TailwindAdvancedEditor />
        </div>
        <div className="col-span-2">
          <button className="rounded-lg flex w-full justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8">
            <UploadIcon className="mx-2" />
            Upload Report
          </button>
          <ReportProcess />
        </div>
      </div>
    </div>
  );
}
