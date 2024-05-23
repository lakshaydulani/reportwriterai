import Image from 'next/image';
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
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      setFiles(previousFiles => [
        ...previousFiles,
        ...acceptedFiles.map(file =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFiles = (name) => {
    setFiles(files => files.filter(file => file.name !== name))
  }
  return (
    <div {...getRootProps({ className })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
      {/* {preview} */}
      <ul>
        {files.map(file => (
          <li key={file.name}>
            <Image 
              src={file.preview} 
              alt='' 
              width={100} 
              height={100} 
              onLoad={() => {
                URL.revokeObjectURL(file.preview)
              }}
              className='h-full w-full object-cover rounded-md'
            />
            <button
              type='button'
              className='w-7 h-7 border-secondary-400 bg-secondary-400 rounded-full'
              onClick={() => removeFiles(file.name)}
            >
              
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
