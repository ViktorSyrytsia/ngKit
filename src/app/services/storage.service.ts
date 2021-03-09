import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private fb: AngularFireStorage) { }

  public async onUpload(id: string, file: any): Promise<string> {
    const fileRef = this.fb.ref(id);
    return fileRef.put(file).then(res => {
      return res.ref.getDownloadURL();
    })
  }
}
