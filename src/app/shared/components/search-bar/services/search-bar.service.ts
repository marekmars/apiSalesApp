import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {
  private searchSubject = new Subject<string>;
  public searchSubject$ = this.searchSubject.asObservable();

  setSearch(searchValue: string): void {
    this.searchSubject.next(searchValue);
  }
}
