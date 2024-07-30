import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'wordWrap'})
export class WordWrapPipe implements PipeTransform {
  transform(value: string, wordLimit: number): string {
    if (!value) return value;
    const words = value.split(' ');
    let result = '';
    for (let i = 0; i < words.length; i++) {
      result += words[i] + ' ';
      if ((i + 1) % wordLimit === 0) {
        result += '\n';
      }
    }
    return result.trim();
  }
}