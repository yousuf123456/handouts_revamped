import Image from "next/image";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@nextui-org/react";
import { UploadFileDropzone } from "@/app/_components/UploadFileDropzone";
import { useContext } from "react";
import { requestFormContext } from "./OrderRequestForm";

export const ProofImages = () => {
  const { requestFormData, setRequestFormData } =
    useContext(requestFormContext);

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg font-semibold">Proof Images</Label>

      {requestFormData.proofImages.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {requestFormData.proofImages.map((image, i) => (
            <div
              key={i}
              className="group relative h-20 w-20 overflow-hidden rounded-sm"
            >
              <Button
                size={"icon"}
                variant={"outline"}
                className="absolute bottom-0 right-0 z-50 h-8 w-8 rounded-none"
                onClick={() =>
                  setRequestFormData((prev) => {
                    return {
                      ...prev,
                      proofImages: prev.proofImages.filter((img, j) => j !== i),
                    };
                  })
                }
              >
                <Delete className="h-5 w-5 text-red-600" />
              </Button>

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

      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"}>Upload Images</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>Upload Images</DialogTitle>
            </DialogHeader>
          </VisuallyHidden>
          <UploadFileDropzone
            onImageUpload={(acceptedFiles: File[]) => {
              setRequestFormData((prev) => ({
                ...prev,
                proofImages: [...prev.proofImages, ...acceptedFiles],
              }));
            }}
            images={requestFormData.proofImages}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
