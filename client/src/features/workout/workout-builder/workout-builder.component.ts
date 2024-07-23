import { Component } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-workout-builder',
  templateUrl: './workout-builder.component.html',
  styleUrl: './workout-builder.component.scss',
})
export class WorkoutBuilderComponent {
  public InputType = InputType;
  public optionArrays = optionArrays;
  public showWorkoutDetails = false;
  public showExercise = false;

  public createWorkoutForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    imageUri: [null, [Validators.required]],
    tags: ['', [Validators.required]],
    numberOfSets: ['', [Validators.required]],
    pauseBetweenSets: ['', [Validators.required]],
    pauseBetweenExercises: ['', [Validators.required]],
    active: [false, [Validators.required]],
    private: [false, [Validators.required]],
    relatedStudent: [null],
    exercises: [[], [Validators.required]]
  });

  public isPrivate: boolean = false;
  isExerciseFormVisible: boolean = false;

  constructor(private readonly fb: FormBuilder) {}

  public onCreateWorkout(): void {
    console.log(this.createWorkoutForm.value);
  }

  onPrivateChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isPrivate = checkbox.checked;
  }

  onActiveChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    //Active checkbox logic goes here
  }

  public workoutDetailsVisibility(): void {
    this.showWorkoutDetails = !this.showWorkoutDetails;
    this.showExercise = false;
  }

  public additionalDetailsVisibility(): void {
    this.showWorkoutDetails = false;
    this.showExercise = false;
  }

  public ExerciseVisibility(): void {
    this.showExercise = !this.showExercise;
    this.showWorkoutDetails = false;
  }


  showExerciseFormPopup = false;
  showExerciseForm() {
    this.showExerciseFormPopup = !this.showExerciseFormPopup;
    console.log('Popup visibility toggled:', this.showExerciseFormPopup); // Add this line to debug
  }

  hasTiming = false;
  onHasTimingChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.hasTiming = checkbox.checked;
  }
}
