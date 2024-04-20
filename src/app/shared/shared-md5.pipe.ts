import { Pipe, PipeTransform } from '@angular/core';
import { Md5 } from 'ts-md5';

@Pipe({
  name: 'md5',
  pure: false
})
export class SharedMD5Pipe implements PipeTransform {
  constructor() { }

  transform(email: string): string {
    const md5 = new Md5();
    md5.appendStr(email);
    const hash = md5.end();

    return hash.toString();
  }

}
