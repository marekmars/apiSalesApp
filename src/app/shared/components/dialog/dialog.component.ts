import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionValue } from '../../interfaces/action-values.interfaces';

@Component({
  selector: 'shared-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  @Input() public showModal: boolean = false;
  @Input() public iconScr: string = '';
  @Input() public title: string = '';
  @Input() public description: string = '';
  @Input() public okBtnTxt: string = 'Ok';
  @Input() public cancelBtnTxt: string = 'Cancel';
  @Input() public cancelBtn: boolean = false;
  @Input() public timmerValue: number = 0;
  @Input() public actionValue!:ActionValue<any>;
  // @Input() public numberValue: number = 0;
  // @Input() public booleanValue: boolean = false;
  // @Input() public txtValue: string = '';
  @Output() public valueOutput = new EventEmitter<ActionValue<any>>;

  ngOnInit(): void {

    if (this.timmerValue > 0) {
      setTimeout(() => {
        this.closeModal();
      }, this.timmerValue);
    }

  }
  onOverlayClick(event: Event): void {
    // Verifica si el clic proviene del fondo de superposición y cierra el modal
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
  onAlertClosed() {
    throw new Error('Method not implemented.');
  }

  closeModal() {
    this.showModal = false;
    this.valueOutput.emit({ value: false, item: null, action: '' });
  }
  showValue() {
    this.showModal = false;

    this.valueOutput.emit({ value: true, item: this.actionValue?.item, action: this.actionValue?.action });

  }

}
