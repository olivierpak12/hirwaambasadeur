'use client';

import { useState, useRef, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface ImageWithCaption {
  storageId: Id<'_storage'>;
  caption: string;
}

interface MultiImageUploadProps {
  onImagesChange: (images: ImageWithCaption[]) => void;
  maxImages?: number;
  label?: string;
}

const MAX_IMAGES = 5;

// Separate component so each image can independently call useQuery
function ImagePreview({
  storageId,
  alt,
  style,
}: {
  storageId: Id<'_storage'>;
  alt: string;
  style?: React.CSSProperties;
}) {
  const url = useQuery(api.files.getImageUrl, { storageId });
  return (
    <img
      src={url ?? '/placeholder-400x400.svg'}
      alt={alt}
      style={style}
    />
  );
}

export default function MultiImageUpload({
  onImagesChange,
  maxImages = MAX_IMAGES,
  label = 'Article Images (up to 5)',
}: MultiImageUploadProps) {
  const [images, setImages] = useState<ImageWithCaption[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleFile = useCallback(
    async (file: File) => {
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

      try {
        const uploadUrl = await generateUploadUrl();

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!response.ok) throw new Error('Upload failed');

        const { storageId } = await response.json();

        // Store just the storageId  preview uses ImagePreview + Convex URL
        const newImage: ImageWithCaption = {
          storageId: storageId as Id<'_storage'>,
          caption: '',
        };

        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        onImagesChange(updatedImages);
      } catch (err) {
        setError('Upload failed. Please try again.');
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, generateUploadUrl, onImagesChange]
  );

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

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const updateCaption = (index: number, caption: string) => {
    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, caption } : img
    );
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 500,
          color: '#a0b8a8',
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        {label}
      </label>

      {/* Upload area */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragOver ? '2px dashed #c9a84c' : '2px dashed #2a4a35',
            background: dragOver
              ? 'rgba(201,168,76,0.05)'
              : 'rgba(255,255,255,0.01)',
            borderRadius: 4,
            padding: 24,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: 16,
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            style={{ display: 'none' }}
            disabled={uploading || images.length >= maxImages}
          />
          <div style={{ color: '#a0b8a8', fontSize: 13 }}>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>
               Drag images here or click to upload
            </div>
            <div style={{ fontSize: 11, color: '#5a8a6a' }}>
              {uploading ? 'Uploading...' : `${images.length}/${maxImages} images`}
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          style={{
            background: '#e05a3a20',
            border: '1px solid #e05a3a',
            color: '#e05a3a',
            padding: 10,
            borderRadius: 3,
            fontSize: 12,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {/* Image gallery */}
      {images.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
          }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              style={{
                background: '#0f2318',
                border: '1px solid #2a4a35',
                borderRadius: 4,
                overflow: 'hidden',
                padding: 8,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 100,
                  background: '#1a3d28',
                  borderRadius: 3,
                  overflow: 'hidden',
                  marginBottom: 8,
                }}
              >
                {/*  FIX: use ImagePreview with storageId  fetches real Convex URL */}
                <ImagePreview
                  storageId={img.storageId}
                  alt={`Upload ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <input
                type="text"
                placeholder="Caption (optional)"
                value={img.caption}
                onChange={(e) => updateCaption(idx, e.target.value)}
                style={{
                  width: '100%',
                  padding: 6,
                  fontSize: 11,
                  background: '#1a3d28',
                  border: '0.5px solid #2a4a35',
                  borderRadius: 2,
                  color: '#a0b8a8',
                  marginBottom: 6,
                  outline: 'none',
                }}
              />

              <button
                onClick={() => removeImage(idx)}
                style={{
                  width: '100%',
                  padding: 4,
                  fontSize: 10,
                  background: '#2a4a35',
                  border: 'none',
                  borderRadius: 2,
                  color: '#a0b8a8',
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
