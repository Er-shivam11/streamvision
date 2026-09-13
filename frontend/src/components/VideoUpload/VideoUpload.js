import React, { useRef, useState } from 'react';
import axios from 'axios';
import './VideoUpload.css';

const API_URL = 'http://localhost:8000';

const formatSize = (bytes) => {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i += 1;
  }
  return `${size.toFixed(1)} ${units[i]}`;
};

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const fileInputRef = useRef(null);

  const applyFile = (file) => {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStatus({ type: '', message: '' });
  };

  const handleFileChange = (e) => applyFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setStatus({ type: 'error', message: 'Please select a video file before uploading.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('media_type', 'video');

    setIsUploading(true);
    setProgress(0);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post(`${API_URL}/api/media/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      });

      if (response.status === 201) {
        setStatus({ type: 'success', message: 'Video uploaded successfully.' });
        setTitle('');
        setDescription('');
        clearFile();
      } else {
        setStatus({ type: 'error', message: 'Failed to upload the video. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong during upload.' });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <video className="drop-preview" src={previewUrl} muted />
          ) : (
            <img className="drop-preview drop-preview-static" src="/images/upl.jpg" alt="" />
          )}

          <div className="drop-overlay">
            {selectedFile ? (
              <>
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">{formatSize(selectedFile.size)}</span>
                <button
                  type="button"
                  className="remove-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <span className="drop-title">Drag a video here</span>
                <span className="drop-subtitle">or click to browse your files</span>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="file-input-hidden"
          />
        </div>

        <div className="upload-side">
          <h2 className="upload-heading">Upload a video</h2>
          <p className="upload-subheading">
            Add the route footage and a short description before publishing.
          </p>

          <form className="upload-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="video-title">Title</label>
            <input
              id="video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Route 14 · Downtown Loop"
              required
              className="input-field"
            />

            <label className="field-label" htmlFor="video-description">Description</label>
            <textarea
              id="video-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this footage show?"
              required
              className="input-field textarea-field"
              rows={4}
            />

            <button type="submit" className="upload-button" disabled={isUploading}>
              {isUploading ? `Uploading… ${progress}%` : 'Upload video'}
            </button>

            {isUploading && (
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            )}

            {status.message && (
              <p className={`upload-status ${status.type}`}>{status.message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;