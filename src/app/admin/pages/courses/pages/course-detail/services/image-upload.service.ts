import { Injectable } from '@angular/core';
import { FileHandle } from '../pipes/drag-ndrop.directive';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import {
  StorageReference,
  uploadBytes,
  UploadResult,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private storage = getStorage();

  constructor() {}

  async uploadImages(files: FileHandle[], id: string): Promise<UploadResult[]> {
    const tasks: UploadResult[] = [];
    const newRef = (fileType: string, i: number) => {
      return ref(
        this.storage,
        `courses/${id}/${id}-${i}.${fileType.replace('image/', '')}`
      );
    };

    const usedIds = [0];

    const fun = async (f: FileHandle, index: number) => {
      let fileRef: StorageReference | undefined;
      let refExists = true;

      for (
        let i = (usedIds[usedIds.length - 1] || 0);
        refExists;
        i++
      ) {
        usedIds.push(i + 1);
        fileRef = newRef(f.file.type, i + 1);
        refExists = await new Promise((refResolve, refReject) => {
          if (!fileRef) return refReject();
          getDownloadURL(fileRef)
            .then((url) => {
              return refResolve(true);
            })
            .catch((error) => {
              if (error.code === 'storage/object-not-found') {
                return refResolve(false);
              } else {
                return refReject(error);
              }
            });
        });
      }

      if (!fileRef) return;
      const uploadTask = await uploadBytes(fileRef, f.file, {
        customMetadata: { originalName: f.file.name },
      });
      tasks.push(uploadTask);
    };
    
    for (let i = 0; i < files.length; i++) {
      await fun(files[i], i);
    }

    return tasks;
  }
}
