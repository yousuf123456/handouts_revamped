import React from "react";

import { toast } from "sonner";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import Dropzone, { FileRejection } from "react-dropzone";
import { Button } from "@/components/ui/button";

export const UploadFileDropzone = ({
  images,
  onImageUpload,
}: {
  images: File[];
  onImageUpload: (acceptedFiles: File[]) => void;
}) => {
  const onDrop = async (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[],
  ) => {
    if (rejectedFiles.length > 0)
      return toast.error(
        "File type must be an image and must be under 4MB in size!",
      );
  };

  // const onConfirm = (acceptedFiles: File[]) => {
  //   setImages((prev) => [...prev, ...acceptedFiles]);
  // };

  return (
    <Dropzone
      multiple={true}
      onDrop={onDrop}
      maxSize={4 * 1024 * 1024}
      accept={{ "image/*": [] }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div className="mt-4 flex w-full flex-col gap-5" {...getRootProps()}>
          <div className="flex h-64 rounded-lg border border-dashed border-zinc-300 transition-opacity hover:border-zinc-400">
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div className="aspect-square max-w-fit rounded-full border border-zinc-200 bg-white p-2 shadow-lg">
                <UploadCloud className="h-7 w-7 text-zinc-600" />
              </div>

              <label htmlFor="dropzone-file-input" className="text-center ">
                <h3 className="mt-3 text-lg font-semibold text-zinc-700">
                  Drag & Drop or Select Images
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Upto 4MB of image files
                </p>
              </label>

              <input
                id="dropzone-file-input"
                {...getInputProps()}
                type="file"
                hidden
              />
            </div>
          </div>

          {acceptedFiles.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {acceptedFiles.map((image, i) => (
                <div
                  key={i}
                  className="relative h-16 w-16 overflow-hidden rounded-sm"
                >
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Uploaded Image"
                    className="object-cover"
                    fill
                  />
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            disabled={acceptedFiles.length === 0}
            onClick={(e) => {
              e.preventDefault();
              onImageUpload(acceptedFiles);
            }}
          >
            Confirm
          </Button>
        </div>
      )}
    </Dropzone>
  );
};
