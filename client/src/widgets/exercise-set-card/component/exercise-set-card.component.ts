import { Component, Input, OnInit } from '@angular/core';
import { ISessionExercise } from '../../../entities/sessions/models/session-exercise.interface';
import { environment } from '../../../shared/environments/environment.development';

@Component({
  selector: 'app-exercise-set-card',
  templateUrl: './exercise-set-card.component.html',
  styleUrls: ['./exercise-set-card.component.scss'],
})
export class ExerciseSetCardComponent implements OnInit {
  @Input() exercise!: ISessionExercise;
  @Input() numberOfSets!: number;

  public fullImagePath: string = '';

  public ngOnInit(): void {
    this.fullImagePath = environment.files + this.exercise?.thumbUri;
  }
}
