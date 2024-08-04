import { Component, Input, OnInit } from '@angular/core';
import { ISessionExercise } from '../../../entities/sessions/models/session-exercise.interface';

@Component({
  selector: 'app-exercise-set-card',
  templateUrl: './exercise-set-card.component.html',
  styleUrls: ['./exercise-set-card.component.scss'],
})
export class ExerciseSetCardComponent implements OnInit {
  @Input() exercise!: ISessionExercise;
  private basePath: string = 'http://localhost:3000/files/';
  public fullImagePath: string = '';

  public ngOnInit(): void {
    this.fullImagePath = this.basePath + this.exercise?.thumbUri;
  }
}
