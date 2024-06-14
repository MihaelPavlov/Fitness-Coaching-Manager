import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() textColor: 'main-text-color' = 'main-text-color';
  @Input() backgroundColor: 'white' | 'main-background-color' = 'main-background-color';

  get getBackgroundColor(): string {
    switch (this.backgroundColor) {
      case 'white': {
        return '#ffffff'
      }
      default: {
        return 'eceef3'
      }
    }
  }

  get getTextColor(): string {
    switch (this.textColor) {
      default: {
        return '#475f93'
      }
    }
  }

  @Output() valueChange = new EventEmitter<string>();

  onInputChange(eventTarget: any) {
    this.valueChange.emit(eventTarget.value);
  }

}
