import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private fb: AngularFireStorage) { }

  public async onUpload(folder: string, fileName: string, file: any): Promise<string> {
    const folderRef = this.fb.ref(folder);
    const imageRef = folderRef.child(fileName);
    return imageRef.put(file).then(res => {
      return res.ref.getDownloadURL();
    })
  }
}
