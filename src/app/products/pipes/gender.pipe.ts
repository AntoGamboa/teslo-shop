import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})

export class genderPipe implements PipeTransform {
  transform(value:string): string {
    if(value === 'kid') return 'niños'
    if(value === 'women') return 'mujeres'
    return 'hombres'
  }
}
