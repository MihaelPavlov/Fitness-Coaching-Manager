import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-background-square',
  templateUrl: './background-square.component.html',
  styleUrl: './background-square.component.scss'
})
export class BackgroundSquareComponent {
@Input() label: string = '';
}
