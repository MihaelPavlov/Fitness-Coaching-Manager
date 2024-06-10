import { Component } from '@angular/core';

export let registeringAsTrainer: boolean

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  registerAsTrainer() {
    registeringAsTrainer = true
  }
}


