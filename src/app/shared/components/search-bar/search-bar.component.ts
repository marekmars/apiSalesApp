import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { SearchBarService } from './services/search-bar.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit {
  private _searchBarService: SearchBarService = inject(SearchBarService);
  private _deBouncer = new Subject<string>();
  private _deBouncerSubscription?: Subscription;
  @Output() public searchEmiter = new EventEmitter<string>();
  @Input() public placeholder = '';
  @Input() public value: string = '';
  ngOnInit(): void {
    this._deBouncerSubscription = this._deBouncer
      .pipe(debounceTime(400))
      .subscribe(
        value => {
          this.searchEmiter.emit(value);
          this._searchBarService.setSearch(value)
        }
      )
  }
  onKeyPress(txtInput: string): void {
    this._deBouncer.next(txtInput)
  }
  ngOnDestroy(): void {
    this._deBouncerSubscription?.unsubscribe();
  }
}
