import { Component, ViewEncapsulation } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { FormBuilder, Validators } from '@angular/forms';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-builder',
  templateUrl: './exercise-builder.component.html',
  styleUrl: './exercise-builder.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ExerciseBuidlerComponent {
  public InputType = InputType;
  public isLoading: boolean = false;
  public optionArrays = optionArrays;
  protected hasExerciseError: boolean = false;
  protected createExerciseErrorMsg: string = '';

  protected exerciseForm = this.fb.group({
    title: ['', Validators.required],
    thumbUri: ['', Validators.required],
    difficulty: ['', Validators.required],
    equipment: ['', Validators.required],
    tag: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly exerciseService: ExerciseService,
    private readonly router: Router
  ) {}

  protected create(): void {
    this.isLoading = true;

    if (this.exerciseForm.invalid) {
      console.log(this.exerciseForm.value);
      this.isLoading = false;
      return;
    }

    this.exerciseService.create(this.exerciseForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.hasExerciseError = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.createExerciseErrorMsg = err.error.data.error;
        this.hasExerciseError = true;
      },
    });
  }
}
