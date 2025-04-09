import { create } from 'zustand';
import { AlbumState, Page, Photo } from '../types';
import { albumObservable, AlbumUpdate } from '../patterns/Observer';

export const useAlbumStore = create<AlbumState>((set) => ({
  pages: [],
  currentPage: null,
  updatePhotoPosition: (photoId: string, x: number, y: number) =>
    set((state) => {
      const updatedPages = state.pages.map((page) => ({
        ...page,
        photos: page.photos.map((photo) =>
          photo.id === photoId
            ? { ...photo, position: { x: (photo.position?.x || 0) + x, y: (photo.position?.y || 0) + y } }
            : photo
        ),
      }));

      albumObservable.notify({
        id: photoId,
        type: 'photo',
        data: {
          photoId,
          position: { x, y }
        }
      });

      return {
        pages: updatedPages,
        currentPage: state.currentPage ? {
          ...state.currentPage,
          photos: state.currentPage.photos.map((photo) =>
            photo.id === photoId
              ? { ...photo, position: { x: (photo.position?.x || 0) + x, y: (photo.position?.y || 0) + y } }
              : photo
          ),
        } : null,
      };
    }),
  updateStickerPosition: (stickerId: string, x: number, y: number) =>
    set((state) => {
      const updatedPages = state.pages.map((page) => ({
        ...page,
        stickers: page.stickers.map((sticker) =>
          sticker.id === stickerId
            ? { ...sticker, position: { x: (sticker.position?.x || 0) + x, y: (sticker.position?.y || 0) + y } }
            : sticker
        ),
      }));

      albumObservable.notify({
        id: stickerId,
        type: 'sticker',
        data: {
          stickerId,
          position: { x, y }
        }
      });

      return {
        pages: updatedPages,
        currentPage: state.currentPage ? {
          ...state.currentPage,
          stickers: state.currentPage.stickers.map((sticker) =>
            sticker.id === stickerId
              ? { ...sticker, position: { x: (sticker.position?.x || 0) + x, y: (sticker.position?.y || 0) + y } }
              : sticker
          ),
        } : null,
      };
    }),
  updatePhotoImagePosition: (pageId: string, photoId: string, position: { x: number; y: number }) =>
    set((state) => {
      const updatedPages = state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              photos: page.photos.map((photo) =>
                photo.id === photoId
                  ? { ...photo, imagePosition: { x: (photo.imagePosition?.x || 0) + position.x, y: (photo.imagePosition?.y || 0) + position.y } }
                  : photo
              ),
            }
          : page
      );

      albumObservable.notify({
        id: pageId,
        type: 'photo',
        data: {
          pageId,
          photoId,
          position
        }
      });

      return {
        pages: updatedPages,
        currentPage: state.currentPage?.id === pageId
          ? {
              ...state.currentPage,
              photos: state.currentPage.photos.map((photo) =>
                photo.id === photoId
                  ? { ...photo, imagePosition: { x: (photo.imagePosition?.x || 0) + position.x, y: (photo.imagePosition?.y || 0) + position.y } }
                  : photo
              ),
            }
          : state.currentPage,
      };
    }),
  updatePhotoScale: (pageId: string, photoId: string, scale: number) =>
    set((state) => {
      const updatedPages = state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              photos: page.photos.map((photo) =>
                photo.id === photoId
                  ? { ...photo, scale: (photo.scale || 1) * scale }
                  : photo
              ),
            }
          : page
      );

      albumObservable.notify({
        id: pageId,
        type: 'photo',
        data: {
          pageId,
          photoId,
          scale
        }
      });

      return {
        pages: updatedPages,
        currentPage: state.currentPage?.id === pageId
          ? {
              ...state.currentPage,
              photos: state.currentPage.photos.map((photo) =>
                photo.id === photoId
                  ? { ...photo, scale: (photo.scale || 1) * scale }
                  : photo
              ),
            }
          : state.currentPage,
      };
    }),
  setPages: (pages: Page[]) => set((state) => ({
    pages,
    currentPage: state.currentPage ? pages.find(p => p.id === state.currentPage?.id) || null : null,
  })),
  setCurrentPage: (pageId: string) => set((state) => ({
    currentPage: state.pages.find(p => p.id === pageId) || null,
  })),
})); 