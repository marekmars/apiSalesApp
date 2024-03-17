import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, HostListener, inject } from '@angular/core';
import { DatePickerService } from './services/date-picker.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'shared-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DatePickerComponent implements OnInit {
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

  @Input() set date(date: Date) {
    console.log("desde el input ", date);
    this.datepickerValue = date.toDateString();
    console.log("desde el input el pickervalue", this.datepickerValue);
    this.month = date.getMonth();
    this.year = date.getFullYear();
  }
  public month!: number;
  public year!: number;
  public no_of_days = [] as number[];
  public blankdays = [] as number[];

  constructor() { }

  ngOnInit(): void {
    this.getNoOfDays();
    let date = new Date(this.datepickerValue);
    this.dateEmiter.emit(date)
    this.sharedDateService.resetDate$.subscribe(() => {
      this.resetToDateToday();
    });
    console.log('Initial datepickerValue:', this.datepickerValue);
  }
  prevMonth(): void {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this.getNoOfDays();
  }

  nextMonth(): void {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this.getNoOfDays();
  }
  yearsRange(): number[] {
    const currentYear = new Date().getFullYear();
    const minYear = new Date(1970, 0, 1).getFullYear()
    const years = [];
    for (let i = minYear; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
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
      console.log("ENTRO NULL")
      return true;
    } else {
      dateSelected = new Date(this.datepickerValue);
    }
    const d = new Date(this.year, this.month, date);

    return dateSelected.toDateString() === d.toDateString() ? true : false;
  }

  getDateValue(date: any) {

    this.month = this.month; // Mantener el mes actual
    this.year = this.year; // Mantener el año actual
    let selectedDate = new Date(this.year, this.month, date);
    console.log("getDateValue", selectedDate.toDateString())
    this.datepickerValue = selectedDate.toDateString();
    this.dateEmiter.emit(selectedDate);
    this.showDatepicker = false;
    console.log('Selected date:', this.datepickerValue);
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
