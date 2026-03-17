'use client';

import { useState, useRef, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface ImageUploadProps {
  onUploadComplete: (url: string, storageId: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUpload({ onUploadComplete, currentImage, label = 'Featured Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveImage = useMutation(api.files.saveImage);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      // Step 1: Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file directly to Convex storage
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { storageId } = await response.json();

      // Step 3: Get the permanent public URL
      const permanentUrl = await saveImage({ storageId });

      if (permanentUrl) {
        setPreview(permanentUrl);
        onUploadComplete(permanentUrl, storageId);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      setPreview(currentImage || null);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [generateUploadUrl, saveImage, onUploadComplete, currentImage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onUploadComplete('', '');
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 500,
        color: '#a0b8a8', letterSpacing: 1, textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        {label}
      </label>

      {preview ? (
        /* Preview state */
        <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', border: '0.5px solid #2a4a35' }}>
          <img
            src={preview}
            alt="Preview"
            style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', background: '#1a3d28' }}
          />
          {uploading && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(15,35,24,0.75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, border: '3px solid #2a4a35',
                borderTop: '3px solid #c9a84c', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ color: '#c9a84c', fontSize: 12, letterSpacing: 1 }}>Uploading...</span>
            </div>
          )}
          {!uploading && (
            <div style={{
              position: 'absolute', top: 10, right: 10, display: 'flex', gap: 8,
            }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: '#0f2318', color: '#c9a84c', border: '0.5px solid #c9a84c',
                  padding: '6px 12px', borderRadius: 3, fontSize: 11, cursor: 'pointer',
                  letterSpacing: 1,
                }}
              >
                Change
              </button>
              <button
                onClick={handleRemove}
                style={{
                  background: '#0f2318', color: '#a0b8a8', border: '0.5px solid #2a4a35',
                  padding: '6px 12px', borderRadius: 3, fontSize: 11, cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${dragOver ? '#c9a84c' : '#2a4a35'}`,
            borderRadius: 4,
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? '#1a3d28' : '#0f2318',
            transition: 'all 0.15s',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>📷</div>
          <p style={{ color: '#f0ece0', fontSize: 14, fontFamily: 'Georgia, serif', marginBottom: 6 }}>
            Drop your photo here
          </p>
          <p style={{ color: '#a0b8a8', fontSize: 12 }}>
            or <span style={{ color: '#c9a84c', textDecoration: 'underline' }}>browse files</span>
          </p>
          <p style={{ color: '#2a4a35', fontSize: 11, marginTop: 10 }}>
            JPG, PNG, WebP · Max 10MB
          </p>
        </div>
      )}

      {error && (
        <p style={{ color: '#e24b4a', fontSize: 12, marginTop: 8 }}>{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}