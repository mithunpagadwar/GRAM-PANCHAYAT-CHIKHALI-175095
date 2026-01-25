import React, { useState, useRef } from "react";
import { storage, isConfigured } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (fileUrl: string, fileType: string) => void;
  previewType?: "image" | "video" | "any";
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = "*",
  onFileSelect,
  previewType = "any",
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isConfigured()) {
      alert(
        "SETUP REQUIRED: Please configure 'firebaseConfig.ts' with your API keys."
      );
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const storageRef = ref(
        storage,
        `uploads/${Date.now()}_${file.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(percent);
        },
        (error) => {
          console.error("Upload failed:", error);
          alert("Upload Failed: " + error.message);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(
            uploadTask.snapshot.ref
          );
          setPreview(downloadURL);
          setUploading(false);
          onFileSelect(downloadURL, file.type);
        }
      );
    } catch (err: any) {
      console.error("Unexpected upload error:", err);
      alert("Unexpected Error: " + err.message);
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          uploading
            ? "bg-blue-50 border-blue-400"
            : "hover:bg-gray-50 border-gray-300"
        }`}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />

        {!preview && !uploading && (
          <div className="text-gray-500">
            <p>Click to upload to Cloud</p>
            <span className="text-xs text-gray-400">
              (Firebase Storage)
            </span>
          </div>
        )}

        {preview && previewType === "image" && (
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 mx-auto rounded shadow"
          />
        )}

        {preview && previewType !== "image" && (
          <div className="text-green-600 font-semibold">
            <p>Uploaded Successfully</p>
            <a
              href={preview}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-blue-500"
            >
              View File
            </a>
          </div>
        )}

        {uploading && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 font-bold">
              Uploading... {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
