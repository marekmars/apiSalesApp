import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'shared-number-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './number-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true
    }
  ]

})
export class NumberInputComponent implements ControlValueAccessor {

  @Input() public maxNumber: number = Number.MAX_SAFE_INTEGER;
  @Input() public imgScr: string = '';
  @Input() public formControl: FormControl = new FormControl();
  @Output() public outputNumber = new EventEmitter<number>();
  @ViewChild('input') inputRef: ElementRef = new ElementRef(null);

  // onChange: any = () => { };
  onTouch: any = () => { };

  writeValue(value: any): void {
    this.formControl.setValue(value, { emitEvent: false }); // Set the value without emitting the event
    this.onChange(this.formControl.value);
    this.formControl.markAsTouched();
  }
  onChange(value: any): void {
    if (this.formControl.value !== value) {
      this.formControl.setValue(value, { emitEvent: false });
      this.onChange(this.formControl.value);
      this.formControl.markAsTouched();
    }
  }

  onBlur(value: string) {
    if (value === '' || value === null || value === undefined) {
      this.formControl.setValue(1, { emitEvent: false });
      this.onChange(this.formControl.value);
      this.formControl.markAsTouched();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // // Tus otros métodos van aquí...
  addNumber() {

    if (Number(this.formControl.value) + 1 <= this.maxNumber) {
      this.formControl.setValue(Number(this.formControl.value) + 1);
      this.onChange(this.formControl.value);
    }
  }

  subNumber() {
    if (Number(this.formControl.value) - 1 > 0) {
      this.formControl.setValue(Number(this.formControl.value) - 1);
      this.onChange(this.formControl.value);
    }
  }

  numericOnly(event: KeyboardEvent): boolean {

    // let patt = /^([0-9])$/;
    // let result = patt.test(event.key);
    // return result;


    const input = event.key;

    // Ensure the input is a number or a '-' sign for negative numbers
    if (!/^\d$/.test(input) && !(input === '-' && this.formControl.value > 0)) {
      return false;
    }

    // Construct the new value if the input is accepted
    const newValue = input === '-' ? '-' + this.formControl.value : this.formControl.value + input;

    // Ensure the new value is within the specified range
    let numericValue = +newValue;

    // Handle the case where the input is not a valid number
    if (isNaN(numericValue)) {
      numericValue = 1; // Set it to the minimum allowed value
    } else {
      // Ensure the value is within the specified range
      numericValue = Math.min(Math.max(1, numericValue), this.maxNumber);
    }

    // Update the form control value
    this.formControl.setValue(numericValue, { emitEvent: false });
    this.onChange(numericValue);

    return false;
  }
}
