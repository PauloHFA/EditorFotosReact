import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Photo, Shape } from '../types';
import { photoObservable, PhotoUpdate } from '../patterns/Observer';

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
        set((state) => {
          const newPhoto = { ...photo, id: Date.now().toString() };
          photoObservable.notify({
            id: newPhoto.id,
            type: 'shape',
            data: { shape: newPhoto.shape }
          });
          return { photos: [...state.photos, newPhoto] };
        }),
      updatePhoto: (id, photo) =>
        set((state) => {
          const updatedPhotos = state.photos.map((p) => 
            p.id === id ? { ...p, ...photo } : p
          );
          
          if (photo.position) {
            photoObservable.notify({
              id,
              type: 'position',
              data: { x: photo.position.x, y: photo.position.y }
            });
          }
          
          if (photo.scale) {
            photoObservable.notify({
              id,
              type: 'scale',
              data: { scale: photo.scale }
            });
          }
          
          return { photos: updatedPhotos };
        }),
      removePhoto: (id) =>
        set((state) => ({
          photos: state.photos.filter((photo) => photo.id !== id),
        })),
      addSticker: (photoId, sticker) =>
        set((state) => {
          const newSticker = { ...sticker, id: Date.now().toString() };
          photoObservable.notify({
            id: photoId,
            type: 'sticker',
            data: { sticker: newSticker }
          });
          return {
            photos: state.photos.map((p) =>
              p.id === photoId
                ? {
                    ...p,
                    stickers: [...p.stickers, newSticker],
                  }
                : p
            ),
          };
        }),
      updateSticker: (photoId, stickerId, updates) =>
        set((state) => {
          const updatedPhotos = state.photos.map((p) =>
            p.id === photoId
              ? {
                  ...p,
                  stickers: p.stickers.map((s) =>
                    s.id === stickerId ? { ...s, ...updates } : s
                  ),
                }
              : p
          );
          
          photoObservable.notify({
            id: photoId,
            type: 'sticker',
            data: { sticker: { id: stickerId, ...updates } as any }
          });
          
          return { photos: updatedPhotos };
        }),
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