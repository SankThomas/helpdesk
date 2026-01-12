import { useState, useRef } from "react";
import { Upload, X, File, Image, FileText } from "lucide-react";
import { Button } from "./Button";

export const FileUpload = ({
  onFileSelect,
  accept = "*/*",
  multiple = false,
  maxSize = 10 * 1024 * 1024,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      if (file.size > maxSize) {
        alert(
          `File ${file.name} is too large. Maximum size is ${
            maxSize / 1024 / 1024
          }MB`
        );
        return false;
      }
      return true;
    });

    if (multiple) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      onFileSelect([...selectedFiles, ...validFiles]);
    } else {
      setSelectedFiles(validFiles.slice(0, 1));
      onFileSelect(validFiles[0]);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(multiple ? newFiles : null);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return <Image className="size-4" />;
    if (file.type.includes("pdf") || file.type.includes("document"))
      return <FileText className="size-4" />;
    return <File className="size-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${
            dragActive
              ? "border-primary-500 bg-primary-50"
              : "border-surface-300 hover:border-primary-400 hover:bg-surface-50"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-3">
          <Upload className="w-8 h-8 text-surface-400 mx-auto" />
          <div>
            <p className="text-surface-700 font-medium">
              Drop files here or click to browse
            </p>
            <p className="text-surface-500 text-sm">
              Maximum file size: {maxSize / 1024 / 1024}MB
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            Choose Files
          </Button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-surface-900">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-surface-50 rounded-lg border border-surface-200"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div>
                  <p className="font-medium text-surface-900">{file.name}</p>
                  <p className="text-sm text-surface-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
