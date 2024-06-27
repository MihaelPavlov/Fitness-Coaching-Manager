import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-library',
  templateUrl: './exercise-library.component.html',
  styleUrl: './exercise-library.component.scss'
})
export class ExerciseLibraryComponent {
  @Input() pageName: string = 'Exercises'

  constructor(private readonly router: Router) {  
  }

  public navigateToDetails(): void{
    this.router.navigateByUrl("exercise/details/1");
  }
}
