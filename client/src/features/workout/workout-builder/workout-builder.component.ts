import { Component, OnInit } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { toFormData } from '../../../shared/utils/formTransformer';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { EXERCISE_FIELDS } from '../../../entities/exercises/models/fields/exercise-fields.constant';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-workout-builder',
  templateUrl: './workout-builder.component.html',
  styleUrl: './workout-builder.component.scss',
})
export class WorkoutBuilderComponent implements OnInit {
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

  public exercises: any;

  public isPrivate: boolean = false;
  isExerciseFormVisible: boolean = false;

  constructor(private readonly fb: FormBuilder, private readonly exerciseService: ExerciseService) {}

  ngOnInit(): void {
    this.fetchExercises().subscribe({
      next: (res: any) => {
        console.log(res)
        this.exercises = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  public onCreateWorkout(): void {
    console.log(this.createWorkoutForm.value);
  }

  public onImageUpload(event: Event): void {
    const filesLength = (event?.target as HTMLInputElement).files?.length;
    const file = (event?.target as HTMLInputElement)?.files?.item((filesLength as number) - 1);
    const selectedImage = this.createWorkoutForm.get('imageUri') as FormControl;
    selectedImage.setValue(file);
  }

  private fetchExercises(): Observable<any> {
    return this.exerciseService.getList({
      what: {
        [EXERCISE_FIELDS.exercises.uid]: 1,
        [EXERCISE_FIELDS.exercises.title]: 1,
        [EXERCISE_FIELDS.exercises.thumbUri]: 1
      }
    })
  }

  onPrivateChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isPrivate = checkbox.checked;
    this.changeCheckBoxStatuses(this.isPrivate);
  }

  onActiveChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.changeCheckBoxStatuses(!checkbox.checked);
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

  private changeCheckBoxStatuses(isPrivate: boolean): void {
    const isPrivateSelected = this.createWorkoutForm.get('private') as FormControl;
    const isActiveSelected = this.createWorkoutForm.get('active') as FormControl;

    if(isPrivate) {
      isPrivateSelected.setValue(true);
      isActiveSelected.setValue(false);
    } else {
      isPrivateSelected.setValue(false);
      isActiveSelected.setValue(true);
    }
  }
}
