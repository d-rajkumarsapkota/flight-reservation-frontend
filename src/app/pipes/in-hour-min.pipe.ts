import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inHourMin'
})
export class InHourMinPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {

    if(value.length > 0){
      let v = value.split(':');    
      return ((v.length-1 > 0) ? (v[0]+'h'+' '+v[1]) : value+'h');
    }
  }

}
