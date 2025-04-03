import { create } from 'zustand';
import { Page, Photo, Shape, Sticker } from './types';

interface AlbumState {
  pages: Page[];
  currentPage: number;
  addPage: () => void;
  addPhoto: (url: string, shape: Shape, imagePosition: { x: number; y: number }, scale: number) => void;
  addSticker: (emoji: string) => void;
  updatePhotoPosition: (pageId: string, photoId: string, position: { x: number; y: number }) => void;
  updateStickerPosition: (pageId: string, stickerId: string, position: { x: number; y: number }) => void;
  updatePhotoImagePosition: (pageId: string, photoId: string, imagePosition: { x: number; y: number }) => void;
  updatePhotoScale: (pageId: string, photoId: string, scale: number) => void;
}

export const useAlbumStore = create<AlbumState>((set) => ({
  pages: [{ id: '1', photos: [], stickers: [] }],
  currentPage: 0,
  
  addPage: () => set((state) => ({
    pages: [...state.pages, { id: Date.now().toString(), photos: [], stickers: [] }],
  })),

  addPhoto: (url, shape, imagePosition, scale) => set((state) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      url,
      shape,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      rotation: 0,
      imagePosition,
      scale,
    };

    const updatedPages = [...state.pages];
    updatedPages[state.currentPage].photos.push(newPhoto);

    return { pages: updatedPages };
  }),

  addSticker: (emoji) => set((state) => {
    const newSticker: Sticker = {
      id: `sticker-${Date.now()}`,
      emoji,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      rotation: 0,
    };

    const updatedPages = [...state.pages];
    updatedPages[state.currentPage].stickers.push(newSticker);

    return { pages: updatedPages };
  }),

  updatePhotoPosition: (pageId, photoId, position) => set((state) => {
    const updatedPages = state.pages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          photos: page.photos.map(photo => 
            photo.id === photoId ? { 
              ...photo, 
              position: {
                x: photo.position.x + position.x,
                y: photo.position.y + position.y
              }
            } : photo
          ),
        };
      }
      return page;
    });

    return { pages: updatedPages };
  }),

  updatePhotoImagePosition: (pageId, photoId, imagePosition) => set((state) => {
    const updatedPages = state.pages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          photos: page.photos.map(photo => 
            photo.id === photoId ? { 
              ...photo, 
              imagePosition: {
                x: photo.imagePosition.x + imagePosition.x,
                y: photo.imagePosition.y + imagePosition.y
              }
            } : photo
          ),
        };
      }
      return page;
    });

    return { pages: updatedPages };
  }),

  updatePhotoScale: (pageId, photoId, scale) => set((state) => {
    const updatedPages = state.pages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          photos: page.photos.map(photo => 
            photo.id === photoId ? { 
              ...photo, 
              scale: Math.max(0.1, Math.min(3, photo.scale * scale))
            } : photo
          ),
        };
      }
      return page;
    });

    return { pages: updatedPages };
  }),

  updateStickerPosition: (pageId, stickerId, position) => set((state) => {
    const updatedPages = state.pages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          stickers: page.stickers.map(sticker => 
            sticker.id === stickerId ? {
              ...sticker,
              position: {
                x: sticker.position.x + position.x,
                y: sticker.position.y + position.y
              }
            } : sticker
          ),
        };
      }
      return page;
    });

    return { pages: updatedPages };
  }),
}));