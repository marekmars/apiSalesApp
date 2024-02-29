import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SortBy } from '../../../interfaces/sort-by.interface';

@Injectable({
  providedIn: 'root'
})
export class SortByService {
  private sortBySubject = new Subject<SortBy>();
  public sortBy$ = this.sortBySubject.asObservable();

  setCurrentPage(sortBy: SortBy): void {
    this.sortBySubject.next(sortBy);
  }


}
