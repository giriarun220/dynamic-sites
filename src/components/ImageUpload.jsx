import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export default function ImageUpload({ onUploadSuccess, label = "Upload Image" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    setError(null);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (err) => {
        setUploading(false);
        setError("Upload failed. Make sure Firebase Storage is enabled and your API keys are correct.");
        console.error(err);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          if (onUploadSuccess) onUploadSuccess(downloadURL);
        } catch (err) {
          setError("Failed to get download URL.");
          setUploading(false);
        }
      }
    );
  };

  return (
    <div className="image-upload-wrapper" style={{ marginTop: '10px', marginBottom: '10px' }}>
      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>{label}</label>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ width: '100%', backgroundColor: '#eee', height: '10px', borderRadius: '5px' }}>
            <div style={{ width: `${progress}%`, backgroundColor: '#0284c7', height: '100%', borderRadius: '5px' }}></div>
          </div>
          <small>Uploading... {Math.round(progress)}%</small>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>{error}</div>}
    </div>
  );
}
