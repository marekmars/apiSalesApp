import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

constructor() { }
private resetDateSource = new Subject<void>();

  showAlert$ = this.resetDateSource.asObservable();

  resetToDateToday() {
    this.resetDateSource.next();
  }
}
