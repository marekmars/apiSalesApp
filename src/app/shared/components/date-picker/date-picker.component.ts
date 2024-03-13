import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerService } from './services/date-picker.service';

@Component({
  selector: 'shared-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent {
  @ViewChild('datepicker') datePicker!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (this.datePicker &&
      !(this.datePicker.nativeElement as HTMLElement).contains(event.target as HTMLElement)
    ) {
      this.showDatepicker = false;
    }
  }
  public readonly MONTH_NAMES: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  private sharedDateService: DatePickerService = inject(DatePickerService);
  public readonly DAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public showDatepicker: boolean = false;
  public datepickerValue!: string;
  @Output() public dateEmiter = new EventEmitter<Date>();
  public month!: number;
  public year!: number;
  public no_of_days = [] as number[];
  public blankdays = [] as number[];

  constructor() { }

  ngOnInit(): void {
    this.initDate();
    this.getNoOfDays();
    let date = new Date(this.datepickerValue);
    this.dateEmiter.emit(date)
    this.sharedDateService.resetDate$.subscribe(() => {
      this.resetToDateToday();
    });
  }
  resetToDateToday(): void {
    this.initDate();
    this.getNoOfDays();
    let date = new Date(this.datepickerValue);
    this.dateEmiter.emit(date);
  }
  initDate() {
    let today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.datepickerValue = new Date(this.year, this.month, today.getDate()).toDateString();
  }

  toggleDatepickerOff() {
    if (this.showDatepicker) {
      this.showDatepicker = false;
    }
  }
  isSelected(date: any) {
    let dateSelected;
    if (this.datepickerValue === undefined) {
      dateSelected = new Date();
      return true;
    } else {
      dateSelected = new Date(this.datepickerValue);
    }
    const d = new Date(this.year, this.month, date);



    return dateSelected.toDateString() === d.toDateString() ? true : false;
  }

  getDateValue(date: any) {
    let selectedDate = new Date(this.year, this.month, date);
    this.datepickerValue = selectedDate.toDateString();

    this.dateEmiter.emit(selectedDate)
    this.showDatepicker = false;
  }

  getNoOfDays() {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    // find where to start calendar day of week
    let dayOfWeek = new Date(this.year, this.month).getDay();
    let blankdaysArray = [];
    for (var i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    let daysArray = [];
    for (var i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    this.blankdays = blankdaysArray;
    this.no_of_days = daysArray;
  }

  trackByIdentity = (index: number, item: any) => item;

}
