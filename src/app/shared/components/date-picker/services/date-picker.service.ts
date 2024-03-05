import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatePickerService {


  private resetDateSource = new Subject<void>();

  resetDate$ = this.resetDateSource.asObservable();

  resetToDateToday() {
    this.resetDateSource.next();
  }
}
