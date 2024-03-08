import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/clients.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../interfaces/clients.interface';
import { initFlowbite } from 'flowbite/lib/esm/components';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    SweetAlert2Module],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css'
})
export class ClientDetailComponent implements OnInit {

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _clientService: ClientService = inject(ClientService);
  private _fb: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);

  public title: string = '';
  public description: string = '';
  public okBtnTxt: string = '';
  public cancelBtnTxt: string = '';
  public notificationTitle: string = '';
  public notificationDescription: string = '';
  public client: Client | null = null;
  public clientForm: FormGroup = this._fb.group({

  });
  public submitButtonTxt: string = 'Add Client';

  constructor() {
    initFlowbite();
    this.clientForm = this._fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(5),]],
      lastName: ['', [Validators.required, Validators.minLength(5)]],
      idCard: ['', [Validators.required, Validators.minLength(5), Validators.pattern("^[0-9]*$")]],
      mail: ['', [Validators.required, Validators.minLength(5), Validators.email]],
    })
  }
  ngOnInit(): void {
    this._activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params.hasOwnProperty('id')) {
            return this._clientService.getClient(params['id'])
          }
          return [];
        }
        )
      )
      .subscribe(
        (res) => {
          this.client = res.data[0];
          if (this.client) {
            console.log(this.client);
            this.clientForm.patchValue(this.client);
            // this.clientForm.patchValue({
            //   id: this.client.id, [Validators.required, Validators.min(1)],
            //   name: this.client.name,
            //   lastName: this.client.lastName,
            //   idCard: this.client.idCard,
            //   mail: this.client.mail
            // })
            this.submitButtonTxt = 'Update Client';
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

  isFieldValid(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }
    if (this.client) {
      console.log("Entro update");
      this._clientService.updateClient(this.clientForm.value as Client)
        .subscribe({
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
              this._router.navigate(['/clients']);
            });
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
                      });
                    }
                  });
                }
              });
            }


          }
        });
      return
    }

    this._clientService.addClient(this.clientForm.value as Client).subscribe({
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
          this._router.navigate(['/clients']);
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
    // Limpia el FormArray 'concepts'


    this.resetForms();


  }
  openDialog() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      console.log(this.clientForm.value);
      return
    }
    if (this.client) {
      this.title = 'Update Client'
      this.description = 'Are you sure you want to update this client?'
      this.okBtnTxt = 'Yes, update it!'
      this.cancelBtnTxt = 'Cancel'
      this.notificationTitle = 'Client updated'
      this.notificationDescription = 'The client has been updated successfully'

    } else {
      this.title = 'Add Client'
      this.description = 'Are you sure you want to add this client?'
      this.okBtnTxt = 'Yes, add it!'
      this.cancelBtnTxt = 'Cancel'
      this.notificationTitle = 'Client added'
      this.notificationDescription = 'The client has been added successfully'
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
    if (this.client) {
      this.clientForm.reset({
        id: [this.client.id, [Validators.required, Validators.min(1)]],
        name: [this.client.name, [Validators.required, Validators.minLength(5)]],
        lastName: [this.client.lastName, [Validators.required, Validators.minLength(5)]],
        idCard: [this.client.idCard, [Validators.required, Validators.minLength(5)]],
        mail: [this.client.mail, [Validators.required, Validators.minLength(5)]],
      })
      return;
    }
  }

 
  //#endregion
  //#region Other Methods
  public cancel() {
    this._router.navigate(['/clients'])
  }
  //#endregion
  //#region Private Methods

  //#endregion
}
