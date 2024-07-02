"use client";
import { defaultEditorContent } from "@/lib/content";
import { EditorCommand, EditorCommandEmpty, EditorCommandItem, EditorCommandList, EditorContent, type EditorInstance, EditorRoot, type JSONContent } from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { useDropzone } from "react-dropzone";
import { useEffect, useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "./ui/separator";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import { useAtom } from 'jotai';
import { generatedContent, initialContent as initialContentAtom } from "@/lib/atom";
import { FileUp } from "lucide-react";
import { AskAI } from "./generative/ask-ai";
import DownloadReport from "./ui/report-process";

type FileWithPreview = File & {
  preview: string;
};

const extensions = [...defaultExtensions, slashCommand];

const TailwindAdvancedEditor = () => {
  const [initialContent, setInitialContent] = useAtom(initialContentAtom); // useState<null | JSONContent>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState(0);

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const [content, setContent] = useAtom(generatedContent);
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"success" | "failure" | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [base64URL, setBase64URL] = useState<string | null>(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON();
    setCharsCount(editor.storage.characterCount.words());
    window.localStorage.setItem("html-content", editor.getHTML());
    window.localStorage.setItem("novel-content", JSON.stringify(json));
    window.localStorage.setItem("markdown", editor.storage.markdown.getMarkdown());
    if(json) setContent(JSON.parse(window.localStorage.getItem("novel-content")));
    setSaveStatus("Saved");
  }, 500);

  useEffect(() => {
    const content = window.localStorage.getItem("novel-content");
    if (content){
      setInitialContent(JSON.parse(content));
      setContent(JSON.parse(content));
    } 
    else{
      setInitialContent(defaultEditorContent);
      setContent(defaultEditorContent);
    } 
  }, []);

  
  const Dropzone = () => {
    const onDrop = useCallback((acceptedFiles) => {
      if (acceptedFiles.length) {
        const uploadedFile = acceptedFiles[0];
        if (uploadedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          setFile(uploadedFile);
          convertToBase64(uploadedFile);
        } else {
          setAlertMessage("Please select a .docx file");
        }
      }
    }, []);
  
    const convertToBase64 = (file) => {
      setIsLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;
          const base64URL = base64String.split(",")[1];
          setBase64URL(base64URL);
  
          const res = await fetch("/api/upload-file", {
            method: "POST",
            body: JSON.stringify({ file: base64URL }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
          }
  
          const data = await res.json();
        
          setInitialContent(data);
          setContent(data);
  
          // setResponse(data);
          setUploadStatus("success");
        } catch (error) {
          console.error("Error uploading file:", error);
          setAlertMessage(`Error uploading file: ${error.message}`);
          setUploadStatus("failure");
        } finally {
          setIsLoading(false);
        }
      };
  
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
        setAlertMessage("Error converting file to base64");
        setIsLoading(false);
      };
    };
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      },
      maxFiles: 1,
      onDrop,
    });
  
    return (
    
        <div className="flex flex-wrap" {...getRootProps()}>
          <button
            className="bg-gray-500 editor-button ${
              isLoad ? 'cursor-not-allowed' : ''
            }`"
            disabled={isLoading}
          >
            <FileUp className="mr-1 h-4 w-4"/>
            <input {...getInputProps({ multiple: false })} />
            {isLoading ? "Importing..." : "Import"}
          </button>
        </div>
      
    );
  }


  if (!initialContent) return null;

  return (
    <div className="relative w-3/4">
      <EditorRoot>
        <EditorContent
          key={JSON.stringify(initialContent)} // Use a key to force re-initialization
          initialContent={initialContent}
          extensions={extensions}
          className="border-muted bg-background rounded-lg h-[calc(100vh-100px)] overflow-auto"
// className="relative h-full w-full shadow-blue-900 border-muted bg-background sm:rounded-lg sm:border sm:shadow-lg"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          {/* <div className="flex absolute right-4 top-2 gap-2 bg-white px-4 py-2 "> */}
            {/* <AskAI setInitialContent = {setInitialContent} setContent = {setContent}/>
            <Dropzone /> */}
            
            {/* <div className="relative flex items-center justify-center min-w-24 px-3 text-sm text-black rounded-lg">{saveStatus}</div>
            <div className={charsCount ? "rounded-lg flex items-center justify-center min-w-28 px-3 text-sm text-black" : "hidden"}>
              {charsCount} Words
            </div> */}
          {/* </div> */}

          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
          <div className="flex absolute right-4 bottom-2 gap-2 bg-white px-4 py-2" >
            <DownloadReport />
          </div>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;
