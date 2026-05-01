"use client";

import { Upload, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import imageCompression from "browser-image-compression";

export const title = "Linear Progress";


interface FileUploadProgressProps {
  onFilesChange?: (files: File[]) => void;       // called whenever file list changes  
  onUploadComplete?: (file: File, info: { key: string; url: string }) => void;
  uploadId?: string
  customerId?: string     // called when a single file upload finishes
  submissionId: number | null;                  // ✅ receive from parent
  onSubmissionCreated: (id: number) => void;
}

//uploadId=documentId
const Example = ({ onFilesChange, onUploadComplete, uploadId, customerId, submissionId, onSubmissionCreated }: FileUploadProgressProps) => {
  const [files, setFiles] = React.useState<File[]>([]);
  //newly add for request flow hadle. creating submissionId

  // Notify parent when files change
  React.useEffect(() => {
    onFilesChange?.(files);
  }, [files, onFilesChange]);

  const [compressing, setCompressing] = React.useState(false);
  // const [uploadKey, setUploadKey] = React.useState(0);

  const onUpload = React.useCallback(async (files: File[], { onProgress, onSuccess, onError, }: {
    onProgress: (file: File, progress: number) => void;
    onSuccess: (file: File) => void;
    onError: (file: File, error: Error) => void;
  },
  ) => {
    if (!uploadId || uploadId === "") {
      //uploadId=documentId
      console.warn("Upload blocked: No document selected (uploadId is empty)");
      // Optionally show a user-friendly error (toast, alert, etc.)
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    const processedFiles: File[] = [];



    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        alert(`❌ Invalid file: ${file.name}`);
        continue;
      }

      let finalFile = file;
      // const resizedFile = await resizeToFixedDimensions(file, 600, 776); // to fixed height and width

      // if (file.type.startsWith("image/") && file.size > 500 * 1024) 
      if (file.type.startsWith("image/") && file.size > 500 * 1024) {

        try {
          setCompressing(true); // show spinner
          const compressed = await imageCompression(file, {
            maxSizeMB: 0.5,
            // maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          finalFile = new File([compressed], file.name, { type: compressed.type });
        } catch (err) {
          console.error("Compression failed", err);
        } finally {
          setCompressing(false);  //  hide spinner regardless of success/error
        }
      }

      processedFiles.push(finalFile);

    }

    setFiles([]); // triggers SET_FILES → clears Map
    await new Promise(resolve => requestAnimationFrame(resolve)); // wait for render
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve)); // wait for render
    await new Promise(resolve => requestAnimationFrame(resolve));
    setFiles(processedFiles);

    for (const file of processedFiles) {
      try {
        const res = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId: uploadId,
            fileName: file.name,
            fileType: file.type,
            submissionId, //newly add for request flow hadle. sending submissionId at first time it is empty,now its not empty create when customer create
            customerId,//newly add for request flow hadle. sending submissionId at first time it is empty

          }),
        });

        // const { signedUrl, key } = await res.json(); // in here signedUrl is for only put (upload) existingn code
        const { signedUrl, key, resolvedSubmissionId } = await res.json(); // //newly add for request flow hadle. getting 
        console.log("from file-upload-pro" + resolvedSubmissionId);
        // setSubmissionId(resolvedSubmissionId);//newly add for setting submission id for next upload
        // notify parent instead of local setState
        if (!submissionId) {
          onSubmissionCreated(resolvedSubmissionId);
        }

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              onProgress(file, percent);

            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {

              resolve();
            } else {
              reject(new Error(`Upload failed: ${xhr.status}`));
            }
          });

          xhr.addEventListener("error", () =>
            reject(new Error("Network error"))
          );

          xhr.open("PUT", signedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file); // Send the raw file — no FormData needed
        });

        // onSuccess(file);
        onUploadComplete?.(file, {
          key,
          url: `/api/signed-url?file=${encodeURIComponent(key)}`, //creating new signed url for viewing images via api/signed-url router
        });
        await new Promise(resolve => setTimeout(resolve, 800));
        onSuccess(file);
      } catch (error) {
        onError(file, error as Error);

      }
      setFiles(prev => prev.filter(f => f !== file)); //deleting after updated files from the list

    }
  },
    [onUploadComplete, uploadId],
  );

  return (
    <FileUpload
      // key={uploadKey}
      maxFiles={10}
      maxSize={10 * 1024 * 1024}
      className="w-full max-w-md"
      value={files}
      onValueChange={setFiles}
      onUpload={onUpload}
      multiple
      disabled={!uploadId || uploadId === ""}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Drag & drop files here</p>
          <p className="text-xs text-muted-foreground">
            Files will show upload progress
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file} >

            <FileUploadItemPreview />
            <div className="flex flex-1 flex-col gap-1">
              <FileUploadItemMetadata />
              {compressing && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  Compressing image...
                </div>
              )}
              <FileUploadItemProgress variant="linear" />
            </div>
            {/* <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X className="size-4" />
              </Button>
            </FileUploadItemDelete> */}
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
};

export default Example;
