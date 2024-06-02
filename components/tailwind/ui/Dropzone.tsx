import Link from "next/link";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2 as DeleteIcon, UploadIcon } from "lucide-react";
import { useAtom } from "jotai";
import {
  generatedContent,
  initialContent as initialContentAtom,
} from "@/lib/atom";
import SectionHeading from "./section-heading";

interface DropzoneProps {
  className?: string;
}

type FileWithPreview = File & {
  preview: string;
};

export const Dropzone: React.FC<DropzoneProps> = ({ className }) => {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "success" | "failure" | null
  >(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [base64URL, setBase64URL] = useState<string | null>(null);
  const [response, setResponse] = useState(null);
  const [initialContent, setInitialContent] = useAtom(initialContentAtom);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const uploadedFile = acceptedFiles[0] as FileWithPreview;
      if (
        uploadedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(uploadedFile);
        convertToBase64(uploadedFile);
      } else {
        setAlertMessage("Please select a .docx file");
      }
    }
  }, []);

  const convertToBase64 = (file: File) => {
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
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }

        const data = await res.json();
        setInitialContent(data.content);

        setResponse(data);
        setUploadStatus("success");
      } catch (error) {
        console.error("Error uploading file:", error);
        setAlertMessage(`Error uploading file: ${error.message}`);
        setUploadStatus("failure");
      }
    };

    reader.onerror = (error) => {
      console.error("Error converting file to base64:", error);
      setAlertMessage("Error converting file to base64");
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    onDrop,
  });

  const removeFile = (e) => {
    setFile(null);
    setUploadStatus(null);
    setAlertMessage(null);
    e.stopPropagation();
  };

  return (
    <section >
      <SectionHeading>
        Upload your current report:
        {uploadStatus && (
          <button onClick={removeFile} className="float-end ml-auto">
            <DeleteIcon />
          </button>
        )}
      </SectionHeading>
      <div
        {...getRootProps({
          className: `${className} ${
            uploadStatus === "success"
              ? "bg-green-600"
              : uploadStatus === "failure"
              ? "bg-red-900"
              : "bg-zinc-600"
          }`,
        })}
      >
        <input {...getInputProps({ multiple: false })} />
        {isDragActive ? (
          <p>Drop your .docx file here ...</p>
        ) : file ? (
          <div>
            <p>
              {uploadStatus === "success"
                ? "Upload successful: "
                : uploadStatus === "failure"
                ? "Upload failed. "
                : ""}
              {file.name}
              
            </p>
          </div>
        ) : (
          <div>
            <UploadIcon className="text-center"/>
            <p>Drag 'n' drop your .docx file here, or click to select a file</p>
            <p>
              {alertMessage && (
                <span className="text-red-500 ml-2">{alertMessage}</span>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
