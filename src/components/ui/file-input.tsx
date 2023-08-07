import { useRef, forwardRef, useState } from "react";
import { Upload } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FileInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  onChange: (value: string) => void;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onChange, ...props }, ref) => {
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (files?.length) {
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (e) => {
          if (typeof e.target?.result === "string") {
            onChange(e.target.result.split(",")[1]);
          }
        };
        setFileName(files[0].name);
      }
    };

    return (
      <>
        <div className="flex rounded-md shadow-sm">
          <Input
            ref={ref}
            type="text"
            disabled
            value={fileName}
            placeholder="Upload file"
            className="rounded-r-none"
          />

          <Button
            type="button"
            className="text-gray-700 border border-gray-100 rounded-l-none bg-gray-50 hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            <span>Upload</span>
          </Button>
        </div>

        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          className="sr-only"
          accept={props.accept}
        />
      </>
    );
  }
);

FileInput.displayName = "FileInput";
