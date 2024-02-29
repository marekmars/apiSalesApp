import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  @Input() public show: boolean = false;
  @Input() public textValue: string = '';
  @Input() public warning?: boolean = false;
  @Input() public success?: boolean = false;
  @Input() public error?: boolean = false;
  closeAlert(): void {
    this.show = false;
  }
}
