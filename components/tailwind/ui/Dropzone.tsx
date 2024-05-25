import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  className?: string;
}

// Define the type for the file object including the preview property
type FileWithPreview = File & {
  preview: string;
};

export const Dropzone: React.FC<DropzoneProps> = ({ className }) => {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'success' | 'failure' | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFile) => {
    if (acceptedFile?.length) {
      const uploadedFile = acceptedFile[0] as FileWithPreview;
      if (uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(uploadedFile);
        uploadFile(uploadedFile);
      } else {
        // File type is not .docx, display an alert
        setAlertMessage('Please select a .docx file');
      }
    }
  }, []);

  const uploadFile = (file: FileWithPreview) => {
    // Simulating an asynchronous file upload process
    setTimeout(() => {
      // Simulate upload success
      setUploadStatus('success');

      // Here, you can perform actual upload logic to your server

      console.log('Upload successful:', file.name);
    }, 2000);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = () => {
    setFile(null);
    setUploadStatus(null);
    setAlertMessage(null);
  };

  return (
    <div
      {...getRootProps({ className: `${className} ${uploadStatus === 'success' ? 'bg-green-200' : uploadStatus === 'failure' ? 'bg-red-900' : ''}` })}
    >
      <input {...getInputProps({ multiple: false })} />
      {isDragActive ? (
        <p>Drop your .docx file here ...</p>
      ) : (
        file ? (
          <p>
            {uploadStatus === 'success' ? 'Upload successful: ' : uploadStatus === 'failure' ? 'Upload failed. ' : ''}
            {file.name}
            {uploadStatus && (
              <button onClick={removeFile} className="ml-2 text-red">Remove</button>
            )}
          </p>
        ) : (
          <div>
          <p>
            Drag 'n' drop your .docx file here, or click to select a file
            </p>
            <p>
            {alertMessage && (
              <span className="text-red-500 ml-2">{alertMessage}</span>
            )}
          </p>
          </div>
        )
      )}
    </div>
  );
};