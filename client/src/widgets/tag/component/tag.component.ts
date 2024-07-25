import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent {
  @Input() text: string = '';

  @Input() backgroundColor: 'dark-grey' | 'main-blue-color' | 'grey' = 'main-blue-color';

  get getBackgroundColor(): string {
    switch (this.backgroundColor) {
      case 'dark-grey': {
        return '#808080'
      }
      case 'grey': {
        return '#808080'
      }
      default: {
        return '#4f69a1'
      }
    }
  }
}