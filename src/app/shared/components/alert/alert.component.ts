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
  @Input() public show = false;
  @Output() public close = new EventEmitter<void>();
  closeAlert(): void {
    this.show = false;
  }

  destroy(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
