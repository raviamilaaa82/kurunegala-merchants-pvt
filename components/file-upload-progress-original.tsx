"use client";

import { Upload } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadItemProgress,
    FileUploadList,
    FileUploadTrigger,
} from "@/components/ui/file-upload";

export const title = "Linear Progress (Original)";

const FileUploadProgressOriginal = () => {
    const [files, setFiles] = React.useState<File[]>([]);

    const onUpload = React.useCallback(
        async (
            files: File[],
            { onProgress, onSuccess, onError }: any
        ) => {
            // Default demo upload simulation
            for (const file of files) {
                try {
                    // simulate progress
                    let progress = 0;
                    const interval = setInterval(() => {
                        progress += 10;
                        onProgress(file, progress);

                        if (progress >= 100) {
                            clearInterval(interval);
                            onSuccess(file);
                        }
                    }, 200);
                } catch (e) {
                    onError(file, e as Error);
                }
            }
        },
        []
    );

    return (
        <FileUpload
            value={files}
            onValueChange={setFiles}
            onUpload={onUpload}
            maxFiles={10}
            maxSize={10 * 1024 * 1024}
            multiple
            className="w-full max-w-md"
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
                    <FileUploadItem key={index} value={file}>
                        <FileUploadItemPreview />
                        <div className="flex flex-1 flex-col gap-1">
                            <FileUploadItemMetadata />
                            <FileUploadItemProgress variant="linear" />
                        </div>
                    </FileUploadItem>
                ))}
            </FileUploadList>
        </FileUpload>
    );
};

export default FileUploadProgressOriginal;