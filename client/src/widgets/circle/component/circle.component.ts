import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
})
export class CircleComponent {
  @Input() text: string = '';
  @Input() value: string = '';
  @Input() width: 'big' | 'small' = 'big';
  @Input() height: 'big' | 'small' = 'big';
  @Input() borderColor: 'main-blue-darker-color' | 'green' | 'orange' =
    'main-blue-darker-color';

  get widthStyle(): string {
    switch (this.width) {
      case 'small': {
        return '8rem';
      }
      default: {
        return '10rem';
      }
    }
  }
  get heightStyle(): string {
    switch (this.height) {
      case 'small': {
        return '8rem';
      }
      default: {
        return '10rem';
      }
    }
  }

  get borderColorStyle(): string {
    switch (this.borderColor) {
      case 'green': {
        return '#47aa9e';
      }
      case 'orange': {
        return '#d95d37';
      }
      default: {
        return '#475f93';
      }
    }
  }
}
