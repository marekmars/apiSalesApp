import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'shared-number-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './number-input.component.html',

})
export class NumberInputComponent {

  @Input() public inputNumber: number = 0;
  @Input() public maxNumber: number = Number.MAX_SAFE_INTEGER;
  @Input() public imgScr: string = '';

  @Output() public outputNumber = new EventEmitter<number>();


  onChange(value: any) {
    if (value == '') {
      this.inputNumber = 1;
      this.outputNumber.emit(this.inputNumber);
    }
    if (this.inputNumber <= this.maxNumber ) {
      this.inputNumber = value;
      this.outputNumber.emit(this.inputNumber);
    } else {
      this.inputNumber = this.maxNumber;
      this.outputNumber.emit(this.inputNumber);
    }
    if(this.inputNumber<1){
      this.inputNumber = 1;
      this.outputNumber.emit(this.inputNumber);
    }

  }

  addNumber() {
    if (Number(this.inputNumber) + 1 <= this.maxNumber) {
      this.inputNumber = Number(this.inputNumber) + 1;
      this.onChange(this.inputNumber);
    }

  }
  subNumber() {
    if (Number(this.inputNumber) - 1 > 0) {
      this.inputNumber = Number(this.inputNumber) - 1;
      this.onChange(this.inputNumber);
    }
  }
  numericOnly(event: KeyboardEvent): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
}
