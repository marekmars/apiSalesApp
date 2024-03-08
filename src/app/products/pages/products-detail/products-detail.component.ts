import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { Product } from '../../interfaces/products.interfaces';
import { Image } from "../../interfaces/images.interface";
import { ProductService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { DragAndDropImgComponent } from "../../../shared/components/drag-and-drop-img/drag-and-drop-img.component";
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageUploadService } from '../../services/image-upload.service';
import { CloudinaryModule } from '@cloudinary/ng';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';


@Component({
  selector: 'app-products-detail',
  standalone: true,
  templateUrl: './products-detail.component.html',
  styleUrl: './products-detail.component.css',
  imports: [CommonModule, ReactiveFormsModule, NumberInputComponent, DragAndDropImgComponent, CloudinaryModule
  ]
})
export class ProductsDetailComponent implements OnInit {

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _productService: ProductService = inject(ProductService);
  private _fb: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _imageUploadService: ImageUploadService = inject(ImageUploadService);

  public imagesFiles: File[] = [];
  public title: string = '';
  public description: string = '';
  public okBtnTxt: string = '';
  public cancelBtnTxt: string = '';
  public notificationTitle: string = '';
  public notificationDescription: string = '';
  public product: Product | null = null;
  public productForm: FormGroup = this._fb.group({

  });
  public submitButtonTxt: string = 'Add Product';

  constructor() {
    initFlowbite();
    this.productForm = this._fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(5),]],
      description: ['', [Validators.min(5)]],
      unitaryPrice: [1, [Validators.required, Validators.min(5)]],
      cost: [1, [Validators.required, Validators.min(5)]],
      stock: [1, [Validators.required, Validators.min(5)]],
      images: this._fb.array([]),
    })
  }
  ngOnInit(): void {

    this._activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params.hasOwnProperty('id')) {
            return this._productService.getProduct(params['id'])
          }
          return [];
        }
        )
      )
      .subscribe(
        (res) => {
          this.product = res.data[0];
          if (this.product) {
            console.log(this.product);
            this.productForm.patchValue(this.product);
            this.submitButtonTxt = 'Update Product';
          }
        }
      )
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.contains(field)) return null;
    const error = form.controls[field].errors || {};
    for (const key of Object.keys(error)) {
      switch (key) {
        case 'required': return "The field is required";
        case 'minlength': return `The minimum length is ${error['minlength'].requiredLength}`;
        case 'min': return `The minimum value is ${error['min'].min}`;
        case 'pattern': return `The value must be a number`;
        case 'email': return `The value must be a valid email`;
        default: break;
      }
      if (field === "idProduct" && error['required']) {
        return "You need to add at least one product to the list";
      }
    }
    return "";

  }
  get images() {
    return this.productForm.get('images') as FormArray
  }

  isFieldValid(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  onSubmit() {

    // if (this.productForm.invalid) {
    //   this.productForm.markAllAsTouched();
    //   return;
    // }
    // if (this.product) {
    //   console.log("Entro update");
    //   this._productService.updateProduct(this.productForm.value as Product)
    //     .subscribe({
    //       next: (res) => {
    //         Swal.fire({
    //           title: this.notificationTitle,
    //           text: this.notificationDescription,
    //           confirmButtonColor: "#4c822a",
    //           icon: "success",
    //           customClass: {
    //             popup: 'swal2-dark',
    //           }
    //         }).then(() => {
    //           this._router.navigate(['/products']);
    //         });
    //       },
    //       error: (err) => {
    //         console.log(err);
    //         if (Object.values(err.error.errors).length > 0) {
    //           Object.values(err.error.errors).forEach((errorArray) => {
    //             if (Array.isArray(errorArray)) {
    //               errorArray.forEach((error: unknown) => {
    //                 if (typeof error === 'string') {
    //                   Swal.fire({
    //                     title: "Error",
    //                     text: error,
    //                     confirmButtonColor: "#4c822a",
    //                     icon: "error",
    //                     customClass: {
    //                       popup: 'swal2-dark',
    //                     }
    //                   });
    //                 }
    //               });
    //             }
    //           });
    //         }


    //       }
    //     });
    //   return
    // }
    for (let i = 0; i < this.imagesFiles.length; i++) {
      this._imageUploadService.uploadImg(this.imagesFiles[i]).subscribe({
        next: (res) => {
          const img:Image={
            url:res.data[0].data.link,
            id:res.data[0].data.deletehash
          }
          this.images.push(this._fb.control(img));
        },
        complete: () => {
          console.log(this.productForm.value);
        }
      })
    }


    // this._productService.addProduct(this.productForm.value as Product).subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     Swal.fire({
    //       title: this.notificationTitle,
    //       text: this.notificationDescription,
    //       confirmButtonColor: "#4c822a",
    //       icon: "success",
    //       customClass: {
    //         popup: 'swal2-dark',
    //       }
    //     }).then(() => {
    //       this._router.navigate(['/products']);
    //     });
    //   },
    //   error: (err) => {
    //     console.log(Object.values(err.error.errors));
    //     // Handle error
    //     if (Object.values(err.error.errors).length > 0) {
    //       Object.values(err.error.errors).forEach((errorArray) => {
    //         if (Array.isArray(errorArray)) {
    //           errorArray.forEach((error: unknown) => {
    //             if (typeof error === 'string') {
    //               Swal.fire({
    //                 title: "Error",
    //                 text: error,
    //                 confirmButtonColor: "#4c822a",
    //                 icon: "error",
    //                 customClass: {
    //                   popup: 'swal2-dark',
    //                 }
    //               });
    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
    // })

    this.resetForms();


  }
  openDialog() {
    // if (this.productForm.invalid) {
    //   this.productForm.markAllAsTouched();
    //   return
    // }
    if (this.product) {
      this.title = 'Update Product'
      this.description = 'Are you sure you want to update this product?'
      this.okBtnTxt = 'Yes, update it!'
      this.cancelBtnTxt = 'Cancel'
      this.notificationTitle = 'Product updated'
      this.notificationDescription = 'The product has been updated successfully'

    } else {
      this.title = 'Add Product'
      this.description = 'Are you sure you want to add this product?'
      this.okBtnTxt = 'Yes, add it!'
      this.cancelBtnTxt = 'Cancel'
      this.notificationTitle = 'Product added'
      this.notificationDescription = 'The product has been added successfully'
    }

    Swal.fire({
      title: this.title,
      text: this.description,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4c822a",
      cancelButtonColor: "#d33 ",
      confirmButtonText: this.okBtnTxt,
      customClass: {
        popup: 'swal2-dark',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSubmit();
      }
    });
  }

  resetForms() {

    if (this.product) {
      this.productForm.reset({
        id: [this.product.id, [Validators.required, Validators.min(1)]],
        name: [this.product.name, [Validators.required, Validators.minLength(5)]],
        unitaryPrice: [this.product.unitaryPrice, [Validators.required, Validators.min(5)]],
        cost: [this.product.cost, [Validators.required, Validators.min(5)]],
        stock: [this.product.stock, [Validators.required, Validators.min(5)]],
        images: this._fb.array([]),
      })
      return;
    }
  }


  //#endregion
  //#region Other Methods
  public cancel() {
    this._router.navigate(['/products'])
  }
  //#endregion
  //#region Private Methods

  //#endregion

  handleFileInput(files: File[]): void {
    this.imagesFiles = files;
  }


  private deleteImage(deleteHash: string): void {
    this._imageUploadService.deleteImage(deleteHash).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  private uploadImages(image: File): void {
    this._imageUploadService.uploadImg(image).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
