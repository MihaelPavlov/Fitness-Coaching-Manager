import { Component, Input } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: InputType = InputType.Text;
  @Input() name: string = '';

  //Style Decorators
  @Input() textColor: 'white' | 'main-background-color' = 'main-background-color';
  @Input() backgroundColor: 'white' | 'main-background-color' = 'main-background-color';

  get getColorHex(): string {
    switch (this.backgroundColor) {
      case 'white': {
        return '#ffffff' 
      }


      default:{
        return ''
      }
    }
  }
}