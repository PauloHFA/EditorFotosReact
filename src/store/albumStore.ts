import { create } from 'zustand';
import { AlbumState, Page } from '../types';

export const useAlbumStore = create<AlbumState>((set) => ({
  pages: [],
  currentPage: null,
  updatePhotoPosition: (photoId: string, x: number, y: number) =>
    set((state) => ({
      pages: state.pages.map((page) => ({
        ...page,
        photos: page.photos.map((photo) =>
          photo.id === photoId
            ? { ...photo, x: photo.x + x, y: photo.y + y }
            : photo
        ),
      })),
      currentPage: state.currentPage ? {
        ...state.currentPage,
        photos: state.currentPage.photos.map((photo) =>
          photo.id === photoId
            ? { ...photo, x: photo.x + x, y: photo.y + y }
            : photo
        ),
      } : null,
    })),
  updateStickerPosition: (stickerId: string, x: number, y: number) =>
    set((state) => ({
      pages: state.pages.map((page) => ({
        ...page,
        stickers: page.stickers.map((sticker) =>
          sticker.id === stickerId
            ? { ...sticker, x: sticker.x + x, y: sticker.y + y }
            : sticker
        ),
      })),
      currentPage: state.currentPage ? {
        ...state.currentPage,
        stickers: state.currentPage.stickers.map((sticker) =>
          sticker.id === stickerId
            ? { ...sticker, x: sticker.x + x, y: sticker.y + y }
            : sticker
        ),
      } : null,
    })),
  updatePhotoImagePosition: (pageId: string, photoId: string, position: { x: number; y: number }) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              photos: page.photos.map((photo) =>
                photo.id === photoId
                  ? { ...photo, imageX: photo.imageX + position.x, imageY: photo.imageY + position.y }
                  : photo
              ),
            }
          : page
      ),
      currentPage: state.currentPage?.id === pageId
        ? {
            ...state.currentPage,
            photos: state.currentPage.photos.map((photo) =>
              photo.id === photoId
                ? { ...photo, imageX: photo.imageX + position.x, imageY: photo.imageY + position.y }
                : photo
            ),
          }
        : state.currentPage,
    })),
  updatePhotoScale: (pageId: string, photoId: string, scale: number) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              photos: page.photos.map((photo) =>
                photo.id === photoId
                  ? { ...photo, scale: photo.scale * scale }
                  : photo
              ),
            }
          : page
      ),
      currentPage: state.currentPage?.id === pageId
        ? {
            ...state.currentPage,
            photos: state.currentPage.photos.map((photo) =>
              photo.id === photoId
                ? { ...photo, scale: photo.scale * scale }
                : photo
            ),
          }
        : state.currentPage,
    })),
  setPages: (pages: Page[]) => set((state) => ({
    pages,
    currentPage: state.currentPage ? pages.find(p => p.id === state.currentPage?.id) || null : null,
  })),
  setCurrentPage: (pageId: string) => set((state) => ({
    currentPage: state.pages.find(p => p.id === pageId) || null,
  })),
})); 