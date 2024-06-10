import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() padding: string = ''; // Input for padding
  @Input() width: '100%' | 'auto' = '100%'; // Input for controlling width
  @Input() fontSize!: string

  //Style Decorators
  @Input() hoverTextColor: 'main-blue-darker-color' = 'main-blue-darker-color'; // Default hover text color
  @Input() hoverBackgroundColor: 'main-background-color' | 'white' = 'main-background-color'; // Default hover background color
  @Input() hoverBorderColor: 'none' | 'main-blue-darker-color' = 'none'; // Input for border color on hover
  @Input() showBorderOnHover: boolean = false; // Input to control border-hover class

  get widthStyle(): string {
    switch (this.width) {
      case 'auto': {
        return 'auto'
      }
      default: {
        return '100%'
      }
    }
  }

  get hoverTextColorStyle(): string {
    switch (this.hoverTextColor) {
      default: {
        return '#475f93'
      }
    }
  }

  get hoverBackgroundColorStyle(): string {
    switch (this.hoverBackgroundColor) {
      case 'white': {
        return '#ffffff'
      }
      default: {
        return '#eceef3'
      }
    }
  }

  get hoverBorderColorStyle(): string {
    switch (this.hoverBorderColor) {
      case 'none': {
        return 'none'
      }
      default: {
        return '#475f93'
      }
    }
  }
}