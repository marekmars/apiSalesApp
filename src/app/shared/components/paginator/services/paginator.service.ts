import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {

  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();

  private pageSelectorSubject = new BehaviorSubject<number>(1);
  public pageSelectorSubject$ = this.pageSelectorSubject.asObservable();

  // Método para actualizar el número de la página actual
  setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
  }
  setPageSelector(page: number): void {
    this.pageSelectorSubject.next(page);
  }
}
