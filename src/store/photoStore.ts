import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Photo, Shape } from '../types';

interface PhotoState {
  photos: Photo[];
  addPhoto: (photo: Omit<Photo, 'id'>) => void;
  updatePhoto: (id: string, photo: Partial<Photo>) => void;
  removePhoto: (id: string) => void;
  addSticker: (photoId: string, sticker: Omit<Photo['stickers'][0], 'id'>) => void;
  updateSticker: (photoId: string, stickerId: string, updates: Partial<Photo['stickers'][0]>) => void;
  removeSticker: (photoId: string, stickerId: string) => void;
}

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set) => ({
      photos: [],
      addPhoto: (photo) =>
        set((state) => ({
          photos: [...state.photos, { ...photo, id: Date.now().toString() }],
        })),
      updatePhoto: (id, photo) =>
        set((state) => ({
          photos: state.photos.map((p) => (p.id === id ? { ...p, ...photo } : p)),
        })),
      removePhoto: (id) =>
        set((state) => ({
          photos: state.photos.filter((photo) => photo.id !== id),
        })),
      addSticker: (photoId, sticker) =>
        set((state) => ({
          photos: state.photos.map((p) =>
            p.id === photoId
              ? {
                  ...p,
                  stickers: [...p.stickers, { ...sticker, id: Date.now().toString() }],
                }
              : p
          ),
        })),
      updateSticker: (photoId, stickerId, updates) =>
        set((state) => ({
          photos: state.photos.map((p) =>
            p.id === photoId
              ? {
                  ...p,
                  stickers: p.stickers.map((s) =>
                    s.id === stickerId ? { ...s, ...updates } : s
                  ),
                }
              : p
          ),
        })),
      removeSticker: (photoId, stickerId) =>
        set((state) => ({
          photos: state.photos.map((p) =>
            p.id === photoId
              ? {
                  ...p,
                  stickers: p.stickers.filter((s) => s.id !== stickerId),
                }
              : p
          ),
        })),
    }),
    {
      name: 'photo-storage',
    }
  )
); 