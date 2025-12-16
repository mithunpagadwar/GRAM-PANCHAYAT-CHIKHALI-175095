import React, { useState, useRef } from 'react';
import { storage, isConfigured } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (fileUrl: string, fileType: string) => void;
  previewType?: 'image' | 'video' | 'any';
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, accept = "*", onFileSelect, previewType = 'any' }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if Firebase is actually configured
    if (!isConfigured()) {
        alert("SETUP REQUIRED: Please configure 'firebaseConfig.ts' with your API keys to enable Cloud Uploads.");
        return;
    }

    setUploading(true);
    setProgress(0);

    // Create a Storage Ref (folder/filename)
    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      }, 
      (error) => {
        console.error("Upload failed", error);
        alert("Upload Failed: " + error.message);
        setUploading(false);
      }, 
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPreview(downloadURL); // Show the CDN URL
          setUploading(false);
          onFileSelect(downloadURL, file.type);
          console.log('File available at', downloadURL);
        });
      }
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          uploading ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50 border-gray-300'
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
        
        {!preview && (
          <div className="text-gray-500">
            <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
            <p>Click to upload to Cloud</p>
            <span className="text-xs text-gray-400">(CDN Powered Storage)</span>
          </div>
        )}

        {preview && previewType === 'image' && (
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded shadow" />
        )}
        
        {preview && previewType !== 'image' && (
          <div className="text-green-600 font-semibold">
             <i className="fas fa-check-circle text-2xl mb-1"></i>
             <p>Uploaded Successfully</p>
             <a href={preview} target="_blank" rel="noreferrer" className="text-xs underline text-blue-500">View File</a>
          </div>
        )}

        {uploading && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gov-secondary h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gov-primary mt-1 font-bold">
               Uploading to Server... {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};