export type Shape = 'square' | 'circle' | 'triangle' | 'hexagon' | 'star';

export interface Photo {
  id: string;
  url: string;
  shape: Shape;
  stickers: Array<{
    id: string;
    emoji: string;
    x: number;
    y: number;
    scale: number;
  }>;
}

export interface Page {
  id: string;
  photos: Photo[];
  stickers: Sticker[];
}

export interface Sticker {
  id: string;
  type: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface PhotoAdjustmentModalProps {
  file: File;
  onClose: () => void;
  onComplete: (url: string, shape: Shape, stickers: Array<{ emoji: string; x: number; y: number; scale: number }>) => void;
}

export interface ImageSize {
  width: number;
  height: number;
}

export interface AlbumState {
  pages: Page[];
  currentPage: Page | null;
  updatePhotoPosition: (photoId: string, x: number, y: number) => void;
  updateStickerPosition: (stickerId: string, x: number, y: number) => void;
  updatePhotoImagePosition: (pageId: string, photoId: string, position: { x: number; y: number }) => void;
  updatePhotoScale: (pageId: string, photoId: string, scale: number) => void;
  setPages: (pages: Page[]) => void;
  setCurrentPage: (pageId: string) => void;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  description: string;
  specifications: {
    engine: string;
    transmission: string;
    mileage: number;
    color: string;
    features: string[];
  };
}

export interface CarState {
  cars: Car[];
  currentCar: Car | null;
  cart: Car[];
  updateCar: (car: Car) => void;
  addToCart: (car: Car) => void;
  removeFromCart: (carId: string) => void;
  setCurrentCar: (car: Car | null) => void;
  setCars: (cars: Car[]) => void;
}