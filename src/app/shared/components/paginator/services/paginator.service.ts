import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  private currentPageSubject = new Subject<number>();
  public currentPage$ = this.currentPageSubject.asObservable();

  private pageSelectorSubject = new Subject<number>();
  public pageSelectorSubject$ = this.pageSelectorSubject.asObservable();

  setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
  }

  setPageSelector(page: number): void {
    this.pageSelectorSubject.next(page);
  }
}
