import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamic',
  standalone: true
})
export class DynamicPipe implements PipeTransform {

  transform(value: any, pipeType: string, propertyName?: string): any {
    switch (pipeType) {
      case 'date':
        return new Date(value).toLocaleDateString(); // Puedes ajustar esto según tus necesidades
      case 'money':
        return '$' + value.toFixed(2);
      case 'boolean':
        return value ? 'Si' : 'No';
      case 'number':
        return value.toFixed(2);
      case 'string':
        return value;
      case 'object':

          return value[propertyName!];

        return value;
      default:
        return value;
    }
  }

}
