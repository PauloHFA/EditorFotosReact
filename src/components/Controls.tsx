import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useAlbumStore } from '../store';
import { PhotoAdjustmentModal } from './PhotoAdjustmentModal';

const STICKERS = ['🌟', '❤️', '🌈', '🦄', '🌸', '✨', '🎨', '🎭'];

export const Controls: React.FC = () => {
  const addPhoto = useAlbumStore((state) => state.addPhoto);
  const addSticker = useAlbumStore((state) => state.addSticker);
  const addPage = useAlbumStore((state) => state.addPage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowAdjustmentModal(true);
    }
  };

  const handlePhotoAdjustmentComplete = (url: string, shape: string, imagePosition: { x: number; y: number }, scale: number) => {
    addPhoto(url, shape, imagePosition, scale);
    setSelectedFile(null);
    setShowAdjustmentModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                Upload Photo
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                {STICKERS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addSticker(emoji)}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <button
                onClick={addPage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Page
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAdjustmentModal && selectedFile && (
        <PhotoAdjustmentModal
          file={selectedFile}
          onConfirm={handlePhotoAdjustmentComplete}
          onClose={() => {
            setShowAdjustmentModal(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        />
      )}
    </>
  );
};