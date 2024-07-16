import { Component, ViewEncapsulation } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { FormBuilder, Validators } from '@angular/forms';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';

@Component({
  selector: 'app-exercise-builder',
  templateUrl: './exercise-builder.component.html',
  styleUrl: './exercise-builder.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ExerciseBuidlerComponent {
  public InputType = InputType;
  protected passwordType: InputType = InputType.Password;

  public optionArrays = optionArrays;

  protected exerciseForm = this.fb.group({
    title:['',Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly exerciseService: ExerciseService,
  ) {}

  protected create(): void {
    if (this.exerciseForm.invalid) {
      return;
    }

    this.exerciseService.create;
  }
}
