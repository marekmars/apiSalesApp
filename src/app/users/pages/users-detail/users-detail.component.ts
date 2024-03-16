import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DragAndDropImgComponent } from '../../../shared/components/drag-and-drop-img/drag-and-drop-img.component';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { ActivatedRoute, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { switchMap, firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { ImageUploadService } from '../../../products/services/image-upload.service';
import { Role, User } from '../../interfaces/user.interfaces';
import { UserService } from '../../services/user.service';
import { Image } from '../../../products/interfaces/images.interface';
import { DropdownComponent } from "../../../shared/components/dropdown/dropdown.component";

@Component({
  selector: 'app-users-detail',
  standalone: true,
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.css',
  imports: [CommonModule,
    ReactiveFormsModule,
    NumberInputComponent,
    DragAndDropImgComponent, DropdownComponent]
})
export class UsersDetailComponent implements OnInit {

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _userService: UserService = inject(UserService);
  private _fb: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _imageUploadService: ImageUploadService = inject(ImageUploadService);

  public maxLengthTextArea: number = 500;
  public imagesToDelete: string[] = [];
  public imagesFiles: File[] = [];
  public title: string = '';
  public description: string = '';
  public okBtnTxt: string = '';
  public cancelBtnTxt: string = '';
  public notificationTitle: string = '';
  public notificationDescription: string = '';
  public user: User | null = null;
  public imageUrls: string[] = [];
  public imgLimit: number = 1;
  public roles: Role[] = []
  public rolesNames: string[] = []

  public selectedRoleName: string = '';
  public userForm: FormGroup = this._fb.group({

  });
  public submitButtonTxt: string = 'Add User';


  constructor() {
    initFlowbite();
    this.userForm = this._fb.group({
      id: [0],
      idRole: [0, [Validators.required, Validators.min(1),]],
      mail: ['', [Validators.minLength(5), Validators.email]],
      password: [null, [Validators.minLength(5)]],
      name: ['', [Validators.required, Validators.min(1)]],
      lastName: ['', [Validators.required, Validators.min(1)]],
      idCard: ['', [Validators.required, Validators.min(1),]],
      avatar: [''],
    })


  }
  ngOnInit(): void {
    this._userService.getRoles().subscribe(
      (res) => {
        this.roles = res.data;
        this.userForm.patchValue({
          idRole: this.roles[0].id
        })
        res.data.forEach((role: Role) => {
          this.rolesNames.push(role.name);
        })
        this.selectedRoleName = this.rolesNames[0];
      }
    )
    this._activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params.hasOwnProperty('id')) {
            return this._userService.getUserById(params['id'])
          }
          return [];
        }
        )

      )
      .subscribe(
        (res) => {
          this.user = res.data[0];
          if (this.user) {
            this.user.password = undefined
            this.userForm.patchValue(this.user);
            this.selectedRoleName = this.user.role?.name ?? this.rolesNames[0];

            console.log(this.user)
            this.imageUrls = this.user?.avatar ? [this.user.avatar.url] : [];
            // this.imgLimit = this.imgLimit - this.imageUrls.length;
            this.submitButtonTxt = 'Update User';
          }
        }
      )
  }
  setRole(roleName: string) {
    const selectedRole = this.roles.find((r) => r.name === roleName);
    this.userForm.patchValue({
      idRole: selectedRole?.id
    })
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.contains(field)) return null;
    const error = form.controls[field].errors || {};
    for (const key of Object.keys(error)) {
      switch (key) {
        case 'required': return "The field is required";
        case 'minlength': return `The minimum length is ${error['minlength'].requiredLength}`;
        case 'min': return `The minimum value is ${error['min'].min}`;
        case 'maxlength': return `The maximum quantity of characters is ${error['maxlength'].requiredLength}`;
        case 'pattern': return `The value must be a number`;
        case 'email': return `The value must be a valid email`;
        default: break;
      }
      if (field === "idUser" && error['required']) {
        return "You need to add at least one user to the list";
      }
    }
    return "";

  }


  isFieldValid(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }
  deleteImg($event: any) {
    console.log($event);
    console.log("antes de borrar ", this.imagesFiles);
    this.imagesToDelete.push($event);
    console.log("despues de borrar ", this.imagesFiles);
  }

  handdleUpdate() {
    const uploadObservables = this.imagesFiles.map(file =>
      this._imageUploadService.uploadImg(file)
    );


    console.log(this.userForm.value);
    Promise.all(uploadObservables.map(obs => firstValueFrom(obs)))
      .then((results) => {
        results.forEach((res: any) => {
          console.log(res);
          const img: Image = {
            url: res.data[0].data.link,
            deleteHash: res.data[0].data.deletehash
          };
          this.userForm.patchValue({
            avatar: img
          })
        });
        this._userService.updateUser(this.userForm.value as User).subscribe({
          next: (res) => {
            Swal.fire({
              title: this.notificationTitle,
              text: this.notificationDescription,
              confirmButtonColor: "#4c822a",
              icon: "success",
              customClass: {
                popup: 'swal2-dark',
              }
            }).then(() => {
              this._router.navigate(['/users']);
            })
          },
          error: (err) => {
            console.log(err);
            if (Object.values(err.error.errors).length > 0) {
              Object.values(err.error.errors).forEach((errorArray) => {
                if (Array.isArray(errorArray)) {
                  errorArray.forEach((error: unknown) => {
                    if (typeof error === 'string') {
                      Swal.fire({
                        title: "Error",
                        text: error,
                        confirmButtonColor: "#4c822a",
                        icon: "error",
                        customClass: {
                          popup: 'swal2-dark',
                        }

                      })
                    }
                  })
                }
              })
            }
          }
        })
      })
      .catch((error) => {
        // Manejar errores si es necesario
        console.error("Error al cargar imágenes:", error);
      });

  }
  handdleAdd() {


    const uploadObservables = this.imagesFiles.map(file =>
      this._imageUploadService.uploadImg(file)
    );

    // Utilizar firstValueFrom para esperar al primer valor de cada observable
    Promise.all(uploadObservables.map(obs => firstValueFrom(obs)))
      .then((results) => {
        results.forEach((res: any) => {
          const img: Image = {
            url: res.data[0].data.link,
            deleteHash: res.data[0].data.deletehash
          };
          this.userForm.patchValue({
            avatar: img
          })
        });
        this._userService.addUser(this.userForm.value as User).subscribe({
          next: (res) => {
            console.log(res);
            Swal.fire({
              title: this.notificationTitle,
              text: this.notificationDescription,
              confirmButtonColor: "#4c822a",
              icon: "success",
              customClass: {
                popup: 'swal2-dark',
              }
            }).then(() => {
              this._router.navigate(['/users']);
            });
          },
          error: (err) => {
            console.log(Object.values(err.error.errors));
            // Handle error
            if (Object.values(err.error.errors).length > 0) {
              Object.values(err.error.errors).forEach((errorArray) => {
                if (Array.isArray(errorArray)) {
                  errorArray.forEach((error: unknown) => {
                    if (typeof error === 'string') {
                      Swal.fire({
                        title: "Error",
                        text: error,
                        confirmButtonColor: "#4c822a",
                        icon: "error",
                        customClass: {
                          popup: 'swal2-dark',
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        })

        this.resetForms();
      })
      .catch((error) => {
        // Manejar errores si es necesario
        console.error("Error al cargar imágenes:", error);
      });
  }
  onSubmit() {

    // if (this.userForm.invalid) {
    //   this.userForm.markAllAsTouched();
    //   return;
    // }
    if (this.user) {
      this.handdleUpdate();
    } else {
      this.handdleAdd();
    }





  }
  openDialog() {
    // if (this.userForm.invalid) {
    //   this.userForm.markAllAsTouched();
    //   return
    // }
    if (this.user) {
      this.title = 'Update User'
      this.description = 'Are you sure you want to update this user?'
      this.okBtnTxt = 'Yes, update it!'
      this.cancelBtnTxt = 'Cancel'
      this.notificationTitle = 'User updated'
      this.notificationDescription = 'The user has been updated successfully'

    } else {
      this.title = 'Add User'
      this.description = 'Are you sure you want to add this user?'
      this.okBtnTxt = 'Yes, add it!'
      this.cancelBtnTxt = 'Cancel'
      this.notificationTitle = 'User added'
      this.notificationDescription = 'The user has been added successfully'
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

    if (this.user) {
      this.userForm.reset({
        id: [0],
        idRole: [0, [Validators.required, Validators.min(1),]],
        mail: ['', [Validators.minLength(5), Validators.email]],
        password: ['', [Validators.minLength(5)]],
        name: ['', [Validators.required, Validators.min(1)]],
        lastName: ['', [Validators.required, Validators.min(1)]],
        idCard: ['', [Validators.required, Validators.min(1),]],
        avatar: [''],
      })
      return;
    }
  }


  //#endregion
  //#region Other Methods
  public cancel() {
    this._router.navigate(['/users'])
  }
  //#endregion
  //#region Private Methods

  //#endregion

  handleFileInput(files: File[]): void {
    this.imagesFiles = files;
    console.log(this.imagesFiles);
  }
}
