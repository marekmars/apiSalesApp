import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statePipe',
  standalone: true
})
export class StatePipe implements PipeTransform {

  transform(value: number): "Activo"|"Inactivo"|null {
    if (value == 1) {
      return "Activo";
    }
    if (value == 0) {
      return "Inactivo";
    }
    return null;
  }

}
