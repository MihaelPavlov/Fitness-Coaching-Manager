import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';

interface InputValidations {
  isRequired: boolean
}

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
  @Input() validations: InputValidations | null = null;
  @Input() errors: any = null;

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

  get hasError(): boolean {
    if (this.errors === null) return false;
    if (Object.keys(this.errors as object).length > 0) return true;
    return false;
  }

  @Output() valueChange = new EventEmitter<string>();

  public onInputChange(eventTarget: any): void {
    this.valueChange.emit(eventTarget.value);
  }
}
