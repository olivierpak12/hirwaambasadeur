'use client';

import { useState, useRef, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

// ── This is the canonical type used everywhere ──
export interface UploadedImage {
  storageId: Id<'_storage'>;
  previewUrl: string; // local blob URL for immediate display only
  caption: string;
}

interface MultiImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  label?: string;
}

export default function MultiImageUpload({
  onImagesChange,
  maxImages = 5,
  label = 'Upload Images',
}: MultiImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Each image must be smaller than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    // Create local blob URL for immediate preview — never stored in DB
    const previewUrl = URL.createObjectURL(file);

    try {
      const uploadUrl = await generateUploadUrl();

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      // Convex returns { storageId } — keep it as the typed Id
      const storageId = data.storageId as Id<'_storage'>;

      const newImage: UploadedImage = { storageId, previewUrl, caption: '' };
      const updated = [...images, newImage];
      setImages(updated);
      onImagesChange(updated);
    } catch (err) {
      URL.revokeObjectURL(previewUrl);
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, generateUploadUrl, onImagesChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].previewUrl);
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated);
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = images.map((img, i) => i === index ? { ...img, caption } : img);
    setImages(updated);
    onImagesChange(updated);
  };

  return (
    <div>
      {/* Drop zone — only shown when under limit */}
      {images.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          style={{
            border: `2px dashed ${dragOver ? '#c9a84c' : '#2a4a35'}`,
            background: dragOver ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.01)',
            borderRadius: 4, padding: 24, textAlign: 'center',
            cursor: uploading ? 'wait' : 'pointer',
            transition: 'all 0.2s', marginBottom: 14,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            style={{ display: 'none' }}
            disabled={uploading}
          />
          {uploading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ width: 16, height: 16, border: '2px solid #2a4a35', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'muSpin 0.7s linear infinite' }} />
              <span style={{ fontSize: 12, color: '#a0b8a8' }}>Uploading…</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 13, color: '#a0b8a8', fontWeight: 500, marginBottom: 4 }}>
                Drag here or click to upload
              </div>
              <div style={{ fontSize: 11, color: '#5a8a6a' }}>
                {images.length}/{maxImages} · JPG, PNG, WebP · Max 10MB
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(224,90,58,0.12)', border: '1px solid #e05a3a', color: '#e05a3a', padding: '8px 12px', borderRadius: 3, fontSize: 12, marginBottom: 12 }}>
          {error}
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#e05a3a', cursor: 'pointer', float: 'right', fontSize: 14, lineHeight: 1 }}>✕</button>
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ background: '#0f2318', border: '1px solid #2a4a35', borderRadius: 4, overflow: 'hidden', padding: 7 }}>
              <div style={{ width: '100%', height: 90, background: '#1a3d28', borderRadius: 3, overflow: 'hidden', marginBottom: 7 }}>
                {/* ✅ Uses local blob URL — instant, no Convex round-trip needed */}
                <img
                  src={img.previewUrl}
                  alt={`Photo ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <input
                type="text"
                placeholder="Caption (optional)"
                value={img.caption}
                onChange={e => updateCaption(idx, e.target.value)}
                style={{ width: '100%', padding: '5px 7px', fontSize: 11, background: '#1a3d28', border: '0.5px solid #2a4a35', borderRadius: 2, color: '#a0b8a8', marginBottom: 6, outline: 'none', boxSizing: 'border-box' }}
              />
              <button
                onClick={() => removeImage(idx)}
                style={{ width: '100%', padding: 4, fontSize: 10, background: '#2a4a35', border: 'none', borderRadius: 2, color: '#a0b8a8', cursor: 'pointer', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes muSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}