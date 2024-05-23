import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() padding: string = ''; // Input for padding
  @Input() fullWidth: boolean = false; // Input for controlling width

  //Style Decorators
  @Input() hoverTextColor: string = ''; // Default hover text color
  @Input() hoverBackgroundColor: string = ''; // Default hover background color

}