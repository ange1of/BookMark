import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: string, phoneFormat?: string): string {
    const format = phoneFormat || '+_(___) ___-__-__';
    const result: string[] = [];

    let ind = 0;
    for (let char of format) {
      if (char === '_') {
        if (ind >= value.length) { break; }
        result.push(value[ind++]);
      } else {
        result.push(char);
      }
    }

    return result.join('');
  }

}
