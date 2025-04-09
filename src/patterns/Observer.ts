type ObserverCallback<T> = (data: T) => void;

export class Observable<T> {
  private observers: ObserverCallback<T>[] = [];

  subscribe(observer: ObserverCallback<T>): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer(data));
  }
}

// Tipos específicos para nosso caso de uso
export type PhotoUpdate = {
  id: string;
  type: 'position' | 'scale' | 'shape' | 'sticker';
  data: {
    x?: number;
    y?: number;
    scale?: number;
    shape?: string;
    sticker?: {
      id: string;
      emoji: string;
      x: number;
      y: number;
      scale: number;
    };
  };
};

export type AlbumUpdate = {
  id: string;
  type: 'page' | 'photo' | 'sticker';
  data: {
    pageId?: string;
    photoId?: string;
    stickerId?: string;
    position?: { x: number; y: number };
    scale?: number;
  };
};

// Instâncias globais dos observables
export const photoObservable = new Observable<PhotoUpdate>();
export const albumObservable = new Observable<AlbumUpdate>(); 