import { Component, Input , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {
  @Input() label: string = '';
  @Input() name!: string;
  @Input() options!: string[];
  @Input() formControlName: string = '';

  @Output() valueChange = new EventEmitter<string>();

  onInputChange(eventTarget: any) {    
    this.valueChange.emit(eventTarget.value);
  }
}
