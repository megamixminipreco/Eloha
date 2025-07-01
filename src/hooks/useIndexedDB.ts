import { useState, useEffect } from 'react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: number;
  uploadDate: Date;
  blob?: Blob;
}

class IndexedDBManager {
  private dbName = 'FrozenInviteDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Criar object store para mídia
        if (!db.objectStoreNames.contains('media')) {
          const mediaStore = db.createObjectStore('media', { keyPath: 'id' });
          mediaStore.createIndex('type', 'type', { unique: false });
          mediaStore.createIndex('uploadDate', 'uploadDate', { unique: false });
        }

        // Criar object store para configurações
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  async saveMedia(mediaFile: MediaFile, blob: Blob): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['media'], 'readwrite');
      const store = transaction.objectStore('media');
      
      const mediaWithBlob = {
        ...mediaFile,
        blob: blob,
        uploadDate: new Date(mediaFile.uploadDate)
      };
      
      const request = store.put(mediaWithBlob);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllMedia(): Promise<MediaFile[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['media'], 'readonly');
      const store = transaction.objectStore('media');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const media = request.result.map((item: any) => {
          if (item.blob) {
            // Recriar URL do blob
            item.url = URL.createObjectURL(item.blob);
          }
          return item;
        });
        resolve(media);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteMedia(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['media'], 'readwrite');
      const store = transaction.objectStore('media');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ key, value });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result?.value || null);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const useIndexedDB = () => {
  const [dbManager] = useState(() => new IndexedDBManager());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    dbManager.init().then(() => setIsReady(true));
  }, [dbManager]);

  return { dbManager, isReady };
};