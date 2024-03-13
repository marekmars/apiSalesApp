import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../clients/interfaces/clients.interface';
import { ClientService } from '../../../clients/services/clients.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Concept, Sale } from '../../interfaces/sales.interfaces';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { DatePickerService } from '../../../shared/components/date-picker/services/date-picker.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { NumberInputComponent } from "../../../shared/components/number-input/number-input.component";
import { Product } from '../../../products/interfaces/products.interfaces';
import { ProductService } from '../../../products/services/products.service';
import { SalesService } from '../../services/sales.service';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { switchMap, tap } from 'rxjs';



import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sales-detail',
  standalone: true,
  templateUrl: './sales-detail.component.html',
  styleUrl: './sales-detail.component.css',
  imports: [CommonModule,
    ReactiveFormsModule,
    DatePickerComponent,
    SearchBarComponent,
    NumberInputComponent,
    SweetAlert2Module]
})
export class SalesDetailComponent implements OnInit {

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _clientService: ClientService = inject(ClientService);
  private _datePickerService: DatePickerService = inject(DatePickerService);
  private _fb: FormBuilder = inject(FormBuilder);
  private _productService: ProductService = inject(ProductService);
  private _router: Router = inject(Router);
  private _saleService: SalesService = inject(SalesService);

  @ViewChild('checkboxAll') checkboxAll!: ElementRef<HTMLInputElement>;
  @ViewChild('tbody') tbody!: ElementRef<HTMLTableSectionElement>;

  public title: string = '';
  public description: string = '';
  public okBtnTxt: string = '';
  public cancelBtnTxt: string = '';
  public notificationTitle: string = '';
  public notificationDescription: string = '';


  public checkedConcepts: number[] = []; // TODO: revisar el any
  public client: Client | null = null;
  public clientName: string = '';
  public clients: Client[] = [];
  public conceptForm: FormGroup;
  public placeholderClient: string = 'Search client by name, last name or id card';
  public placeholderProduct: string = 'Search product by name';
  public product: Product | null = null;
  public productName: string = '';
  public products: Product[] = [];
  public sale: Sale | undefined = undefined;
  public saleForm: FormGroup;
  public selectedDate: Date = new Date();
  public submitButtonTxt: string = 'Add Sale';

  constructor() {
    initFlowbite();
    this.saleForm = this._fb.group({
      id: [0],
      date: [new Date(), [Validators.required, Validators.minLength(3)]],
      idClient: ['', [Validators.required, Validators.min(1)]],
      concepts: this._fb.array([], [Validators.required, Validators.min(1)]),
    })

    this.conceptForm = this._fb.group({
      id: [0],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitaryPrice: [0, [Validators.required, Validators.min(0.01)]],
      idProduct: [0, [Validators.required, Validators.min(1)]],
      product: [{}, [Validators.required, Validators.min(1)]],
    });


  }
  ngOnInit(): void {
    this._activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params.hasOwnProperty('id')) {
            return this._saleService.getSale(params['id'])
          }
          return [];
        }
        )
      )
      .subscribe(
        (res) => {
          this.sale = res.data[0];
          if (this.sale) {
            this.saleForm.patchValue(this.sale);
            if (this.sale.concepts) {
              this.sale.concepts.forEach((concept: Concept) => {
                this.concepts.push(this._fb.group(concept));
              });
            }
            this.client = this.sale.client as Client;
            this.clientName = `${this.client.lastName} ${this.client.name}`;
            this.submitButtonTxt = 'Update Sale';
            console.log(this.saleForm.value);
          }
        }
      )
  }

  //#region Client Methods
  selectClient(client: Client) {
    this.saleForm.controls['idClient'].setValue(client.id)
    this.clients = [];
    this.clientName = client.lastName + ' ' + client.name
  }
  searchClient(search: string) {
    if (search.length > 0) {
      this._clientService.getClients(undefined, 5, search, undefined, undefined)
        .subscribe(
          (res) => this.clients = res.data
        );
    } else {
      this.clients = []
      this.clientName = ''
      this.client = null
    }

  }
  //#endregion
  //#region Product Methods

  selectProduct(product: Product) {
    this.conceptForm.controls['idProduct'].setValue(product.id)
    this.conceptForm.controls['unitaryPrice'].setValue(product.unitaryPrice)
    this.conceptForm.controls['product'].setValue(product)
    this.products = [];
    this.product = product
    this.productName = product.name

  }
  searchProduct(search: string) {
    if (search.length > 0) {
      this._productService.getProducts(undefined, 5, search, undefined, undefined).subscribe((res) => this.products = res.data.filter((product: Product) => product.stock > 0));
    } else {
      this.products = []
      this.productName = ''
      this.product = null
    }
  }

  //#endregion
  //#region Form Methods
  addConcept() {
    if (this.conceptForm.invalid) {
      this.conceptForm.markAllAsTouched();
      return;
    }
    // Agregar el nuevo concepto al FormArray 'concepts'
    if (this.concepts.controls.some((control) => control.value.idProduct === this.conceptForm.value.idProduct)) {
      const existingControl = this.concepts.controls.find((control) => control.value.idProduct === this.conceptForm.value.idProduct);
      if (existingControl) {
        existingControl.patchValue({
          quantity: existingControl.value.quantity + this.conceptForm.get('quantity')?.value,
        });
      }

    } else {
      this.concepts.push(this._createConceptFormGroup(this.conceptForm.value));
    }

    this.productName = '';
    this.conceptForm.reset({
      quantity: 1,
      unitaryPrice: 0,
      idProduct: 0,
      product: {},
    });

  }

  get concepts() {
    return this.saleForm.get('concepts') as FormArray
  }
  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.contains(field)) return null;
    const error = form.controls[field].errors || {};
    for (const key of Object.keys(error)) {
      switch (key) {
        case 'required': return "The field is required";
        case 'minlength': return `The minimum length is ${error['minlength'].requiredLength}`;
        case 'min': return `The minimum value is ${error['min'].min}`;
        default: break;
      }
      if (field === "idProduct" && error['required']) {
        return "You need to add at least one product to the list";
      }
    }
    return "";

  }
  handleCheckboxChange($event: any, index: any) {
    if ($event.target.checked) {
      this.checkedConcepts.push(index);
    } else {
      this.checkedConcepts.splice(this.checkedConcepts.indexOf(index), 1);
    }
  }
  isFieldValid(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  onCheckboxAllChange($event: any) {
    if ($event.target.checked) {
      this.concepts.controls.forEach((control, index) => {
        this.checkedConcepts.push(index);
      })
    } else {
      this.checkedConcepts = [];
    }
  }

  handleUpdate() {
    this._saleService.updateSale(this.saleForm.value as Sale)
      .subscribe({
        next: (res) => {
          console.log(res.message);
          if(res.success===0){
            Swal.fire({
              title: "Error",
              text: "The sale could not be updated due to an internal server error " + res.message,
              confirmButtonColor: "#4c822a",
              icon: "error",
              customClass: {
                popup: 'swal2-dark',
              }
            })
            return
          }
          Swal.fire({
            title: this.notificationTitle,
            text: this.notificationDescription,
            confirmButtonColor: "#4c822a",
            icon: "success",
            customClass: {
              popup: 'swal2-dark',
            }
          }).then(() => {
            //         const conceptsFormArray = this.saleForm.get('concepts') as FormArray;
            // conceptsFormArray.clear();

            // this.resetForms();
            // this.selectedDate = new Date();
            // this.clientName = '';
            // this.productName = '';
            // this.client = null;
            // this.product = null;

            // this._datePickerService.resetToDateToday();
            this._router.navigate(['/sales']);

          });
        },
        error: (err) => {

          // Handle error
          Swal.fire({
            title: "Error",
            text: "The sale could not be updated",
            confirmButtonColor: "#4c822a",
            icon: "error",
            customClass: {
              popup: 'swal2-dark',
            }
          })
        }
      });
  }
  handleAdd() {
    this._saleService.addSale(this.saleForm.value as Sale).subscribe({
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
          this._router.navigate(['/sales']);
        });
      },
      error: (err) => {
        // Handle error
        Swal.fire({
          title: "Error",
          text: "The sale could not be updated",
          confirmButtonColor: "#4c822a",
          icon: "error",
          customClass: {
            popup: 'swal2-dark',
          }
        })
      }
    })
  }

  onSubmit() {

    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }
    if (this.sale) {
      console.log(this.saleForm.value);
      this.handleUpdate();
    }else{
      this.handleAdd();
    }

    // Limpia el FormArray 'concepts'



  }
  openDialog() {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return
    }
    if (this.sale) {
      this.title = 'Update Sale'
      this.description = 'Are you sure you want to update this sale?'
      this.okBtnTxt = 'Yes, update it!'
      this.cancelBtnTxt = 'Cancel'
      this.notificationTitle = 'Sale updated'
      this.notificationDescription = 'The sale has been updated successfully'

    } else {
      this.title = 'Add Sale'
      this.description = 'Are you sure you want to add this sale?'
      this.okBtnTxt = 'Yes, add it!'
      this.cancelBtnTxt = 'Cancel'
      this.notificationTitle = 'Sale added'
      this.notificationDescription = 'The sale has been added successfully'
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

  removeAllSelectedConcepts() {

    let deleteIndex: number[] = [];
    this.checkedConcepts.forEach((index) => {
      deleteIndex.push(index);
    });

    // Ordena los índices en orden descendente
    deleteIndex.sort((a, b) => b - a);

    for (let i = 0; i < deleteIndex.length; i++) {
      this.removeConcept(deleteIndex[i]);
    }

    this.checkedConcepts = [];
    this.checkboxAll.nativeElement.checked = false;
    this.tbody.nativeElement.querySelectorAll('input[type="checkbox"]').forEach((element) => {
      const checkbox = element as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = false;
      }
    });


  }

  removeConcept($index: number) {

    this.concepts.removeAt($index);
  }
  resetForms() {

    this.saleForm.reset({
      date: new Date(),  // Ahora proporciona un objeto Date directamente
      idClient: '',
      concepts: this._fb.array([], [Validators.required, Validators.min(1)]),
    });

    this.conceptForm.reset({
      quantity: 1,
      unitaryPrice: 0,
      idProduct: 0,
      product: {},
    });
  }

  public setDate(date: Date) {
    this.saleForm.controls['date'].setValue(date)
  }
  //#endregion
  //#region Other Methods
  public cancel() {
    this._router.navigate(['/sales'])
  }
  //#endregion
  //#region Private Methods
  private _createConceptFormGroup(concept: Concept): FormGroup {
    return this._fb.group({
      idProduct: [concept.idProduct, [Validators.required, Validators.min(0.01)]],
      quantity: [concept.quantity, [Validators.required, Validators.min(0.01)]],
      unitaryPrice: [concept.unitaryPrice, [Validators.required, Validators.min(0.01)]],
      product: [concept.product, [Validators.required, Validators.min(0.01)]],
    });
  }
  //#endregion
}
