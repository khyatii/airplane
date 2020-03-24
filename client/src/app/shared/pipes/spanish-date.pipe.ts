import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spanishDate'
})
export class SpanishDatePipe implements PipeTransform {

  transform(value: string): string {
    return new Date(value).toLocaleDateString('es')
  }

}
