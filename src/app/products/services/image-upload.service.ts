import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Observable, from, switchMap } from 'rxjs';

import { APIResponse } from '../../shared/interfaces/api-response.interfaces';
import { environments } from '../../../environments/environments';
import { ImageUploadModel } from '../interfaces/image-upload-model.interfaces';
@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private _imageCompress: NgxImageCompressService = inject(NgxImageCompressService);
  private _http: HttpClient = inject(HttpClient);
  private _url: string = environments.baseUrl + '/images';

  uploadImg(image: File): Observable<APIResponse<any>> {
    return new Observable(observer => {
      // Comprime la imagen antes de la carga.
      this.getCompressedImage(image).then(compressedImage => {
        // Crea un objeto con la propiedad 'image' que contiene la imagen comprimida.
        const img: ImageUploadModel = {
          image: compressedImage
        };

        // Realiza la solicitud HTTP POST a la URL especificada con el objeto img como cuerpo de la solicitud.
        this._http.post<APIResponse<any>>(this._url, img)
          .subscribe({
            // Maneja la respuesta exitosa de la solicitud.
            next: (response) => {
              observer.next(response);
              observer.complete();
            },
            // Maneja cualquier error durante la solicitud.
            error: (error) => {
              observer.error(error);
              observer.complete();
            },
            // Se ejecuta cuando la solicitud se completa (ya sea éxitosa o con error).
            complete: () => {
              observer.complete();
            }
          }

          );
      });
    });
  }

  deleteImage(id: string): Observable<APIResponse<any>> {
    return this._http.delete<APIResponse<any>>(`${this._url}/${id}`);
  }

  deleteImagesByUrl(url: string) {
    const deleteUrl = `${this._url}/deleteByUrl?url=${url}`;
    console.log(deleteUrl);
    return this._http.delete<APIResponse<any>>(deleteUrl);
  }
  async getCompressedImage(image: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.compressFile(e.target!.result as string).then(compressedImage => {
          resolve(compressedImage);
        });
      };
      reader.readAsDataURL(image);
    });
  }


  private compressFile(image: string, quality: number = 50, size: number = 50): Promise<string> {
    return new Promise((resolve, reject) => {
      this._imageCompress.compressFile(image, -1, quality, size).then(
        result => {
          // Remove data url prefix
          const base64Image = result.split(',')[1];
          resolve(base64Image);
        },
        error => {
          reject(error);
        }
      );
    });
  }

}
