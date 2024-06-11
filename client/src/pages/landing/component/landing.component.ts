import { Component } from '@angular/core';
import { RegistrationType } from '../../../shared/enums/registration-type.enum';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  public registrationType = RegistrationType

  constructor(private readonly router: Router) {}

  navigateToRegister(registrationType: RegistrationType) {
    this.router.navigate(['/register/' + registrationType])
  }
}


