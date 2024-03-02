import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Concept, Sale } from '../../interfaces/sales.interfaces';
import { Subscription, switchMap } from 'rxjs';
import { SalesService } from '../../services/sales.service';
import { initFlowbite } from 'flowbite';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { SearchBarService } from '../../../shared/components/search-bar/services/search-bar.service';
import { ClientService } from '../../../clients/services/clients.service';
import { Client } from '../../../clients/interfaces/clients.interface';
import { Product } from '../../../products/interfaces/products.interfaces';
import { ProductService } from '../../../products/services/products.service';
import { NumberInputComponent } from "../../../shared/components/number-input/number-input.component";

@Component({
  selector: 'app-sales-detail',
  standalone: true,
  templateUrl: './sales-detail.component.html',
  styleUrl: './sales-detail.component.css',
  imports: [CommonModule,
    ReactiveFormsModule,
    DatePickerComponent,
    SearchBarComponent, NumberInputComponent]
})
export class SalesDetailComponent implements OnInit {

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _saleService: SalesService = inject(SalesService);
  private _router: Router = inject(Router);
  private _clientService: ClientService = inject(ClientService);
  private _productService: ProductService = inject(ProductService);
  private _fb: FormBuilder = inject(FormBuilder);

  public clients: Client[] = [];
  public products: Product[] = [];

  public client: Client | null = null;
  public product: Product | null = null;

  public productName: string = '';
  public clientName: string = '';
  public saleForm: FormGroup;
  public selectedDate: Date = new Date();

  public sale: Sale | undefined = undefined;
  public placeholderClient = 'Search client by name, last name or id card';
  public placeholderProduct = 'Search product by name';
  constructor() {
    initFlowbite();

    this.saleForm = this._fb.group({
      date: ['', [Validators.required, Validators.minLength(3)]],
      idClient: ['', [Validators.required, Validators.min(1)]],
      concepts: this._fb.array([]),
    })

    // this.concepts = this._fb.group({
    //   idProduct: ['', [Validators.required, Validators.min(0.01)]],
    //   quantity: ['', [Validators.required, Validators.min(0.01)]],
    //   unitaryPrice: ['', [Validators.required, Validators.min(0.01)]],
    //   total: ['', [Validators.required, Validators.min(0.01)]],
    //   stock: ['', [Validators.required, Validators.min(1)]],
    // });
  }
  get concepts() {
    return this.saleForm.get('concepts') as FormArray
  }

  ngOnInit(): void {
    this._activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params.hasOwnProperty('id')) {
            console.log(params);
            return this._saleService.getSale(params['id'])
          }
          return [];
        }
        )
      )
      .subscribe(
        (res) => this.sale = res.data[0]
      )
  }

  public getDate(date: Date) {
    this.saleForm.controls['date'].setValue(date)
  }
  public cancel() {
    this._router.navigate(['/sales'])
  }



  selectClient(client: Client) {
    this.saleForm.controls['idClient'].setValue(client.id)
    this.clients = [];
    this.clientName = client.lastName + ' ' + client.name
  }
  searchClient(search: string) {
    if (search.length > 0) {
      this._clientService.getClients(undefined, 5, search, undefined, undefined).subscribe((res) => this.clients = res.data);
    }

  }
  selectProduct(product: Product) {
    // if (this.conceptsInput.invalid) return;

    this.products = [];
    this.product = product;
    this.productName = product.name

    // Crear un FormGroup para el nuevo concepto
    const newConcept = this._fb.group({
      quantity: [5, [Validators.required, Validators.min(0.01)]],
      unitaryPrice: [150, [Validators.required, Validators.min(0.01)]],
      import: [16156, [Validators.required, Validators.min(0.01)]],
      idProduct: [product.id, [Validators.required, Validators.min(0.01)]],
    });

    // Agregar el nuevo concepto al FormArray 'concepts'
    this.concepts.push(newConcept);

  }
  searchProduct(search: string) {
    if (search.length > 0) {
      this._productService.getProducts(undefined, 5, search, undefined, undefined).subscribe((res) => this.products = res.data);
    } else {
      this.products = []
      this.productName = ''
      this.product = null
    }

  }

  onSubmit() {
    console.log(this.saleForm.value);
  }

  onQuantityChange(number: number) {
    console.log("Numero " + number);
  }

  private _createConceptFormGroup(concept: Concept): FormGroup {
    return this._fb.group({
      idProduct: [concept.idProduct, [Validators.required, Validators.min(0.01)]],
      quantity: [concept.quantity, [Validators.required, Validators.min(0.01)]],
      unitaryPrice: [concept.unitaryPrice, [Validators.required, Validators.min(0.01)]],
    });
  }
}
