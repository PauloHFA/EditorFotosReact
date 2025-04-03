import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2 } from 'lucide-react';
import { PhotoAdjustmentModal } from './components/PhotoAdjustmentModal';
import { usePhotoStore } from './store/photoStore';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const { photos, addPhoto, removePhoto } = usePhotoStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowAdjustmentModal(true);
    }
  };

  const handlePhotoAdjustmentComplete = (url: string, shape: string, stickers: Array<{ emoji: string; x: number; y: number; scale: number }>) => {
    addPhoto({ url, shape, stickers });
    setSelectedFile(null);
    setShowAdjustmentModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseModal = () => {
    setShowAdjustmentModal(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Editor de Imagens - Formas Geométricas</h1>
          <p className="text-gray-600">Transforme suas fotos em belas formas geométricas</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Arraste e solte sua foto aqui, ou clique para selecionar</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Selecionar Foto
            </label>
          </div>
        </div>

        {/* Processed Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative group">
                <img
                  src={photo.url}
                  alt="Foto processada"
                  className={`w-full h-64 object-cover ${photo.shape}`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center space-x-2">
                  <a
                    href={photo.url}
                    download={`foto-forma-${photo.id}.png`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remover</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Photo Adjustment Modal */}
      {showAdjustmentModal && selectedFile && (
        <PhotoAdjustmentModal
          file={selectedFile}
          onClose={handleCloseModal}
          onComplete={handlePhotoAdjustmentComplete}
        />
      )}
    </div>
  );
}

export default App;