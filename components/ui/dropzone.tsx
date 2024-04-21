"use client";

import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { sendReplicateServerRequest } from "@/app/[locale]/(dashboard)/dashboard/actions";
import { UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

// type Props = {
//   children?: React.ReactNode;
//   files: File[];
//   setFiles: React.Dispatch<React.SetStateAction<File[]>>;
// };

export default function Dropzone({ maxFiles }: { maxFiles?: number }) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const multiple = !!maxFiles && maxFiles > 1;
  const shouldRedirectToBilling = !maxFiles || maxFiles < 1;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
    multiple,
    maxFiles,
  });

  return (
    <>
      {files.length ? (
        <div className="flex rounded-md border border-border flex-col">
          <div className="grid grid-cols-3">
            {files.map((file) => (
              <div
                key={file.name}
                className="relative w-full p-2 aspect-square min-w-32 rounded-md"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full aspect-square rounded-md object-cover"
                />
                <div className="w-5 h-5 bg-foreground text-background absolute top-1 right-1 rounded-md flex justify-center items-center">
                  <X
                    width={16}
                    height={16}
                    onClick={() => {
                      setFiles((prevFiles) =>
                        prevFiles.filter(
                          (prevFile) => prevFile.name !== file.name
                        )
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            className="w-full mt-2"
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);

              const formData = files.map((file) => {
                const form = new FormData();
                form.append("file", file);
                return form;
              });

              await sendReplicateServerRequest(formData);

              setLoading(false);
              setFiles([]);
            }}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          onClick={(e) => {
            e.preventDefault();

            if (shouldRedirectToBilling) {
              router.push("/dashboard/billing");
              return;
            } else {
              const rootProps = getRootProps();
              if (rootProps.onClick) rootProps.onClick(e);
            }
          }}
          className="flex h-32 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-input dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
        >
          {!shouldRedirectToBilling && (
            <input {...getInputProps()} className="hidden" />
          )}
          {isDragActive ? (
            <div className="flex w-full flex-col items-center justify-center rounded-md bg-slate-500">
              <p className="mb-4">Drop the files here</p>
              <UploadCloud
                width={24}
                height={24}
                className="scale-[1.2] text-white transition-all"
              />
            </div>
          ) : (
            <div className="flex w-full cursor-pointer flex-col items-center justify-center">
              <p className="mb-4 hidden sm:block">
                Drag and drop an image here or click
              </p>
              <p className="mb-4 block sm:hidden">Click here to add images</p>
              <UploadCloud width={24} height={24} className=" text-slate-400" />
            </div>
          )}
        </div>
      )}
    </>
  );
}
