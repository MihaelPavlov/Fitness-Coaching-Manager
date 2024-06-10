import { Component, Input, Output, EventEmitter } from '@angular/core';
import { } from '@angular/forms';

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

  @Output() valueChange = new EventEmitter<string>();

  onInputChange(eventTarget: any) {    
    this.valueChange.emit(eventTarget.value);
  }
}