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
  public hasTiming = false;

  public tagsDropdownSettings = {
    singleSelection: false,
    idField: 'uid',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    //allowSearchFilter: true
  }

  public tags: any;

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
    exercises: [[], [Validators.required]],
  });

  public addExerciseForm = this.fb.group({
    exerciseId: [null, [Validators.required]],
    thumbUri: [''],
    rank: [0, [Validators.required]],
    title: ['', [Validators.required]],
    hasTiming: [false, [Validators.required]],
    description: ['', [Validators.required]],
    repetitions: [0, [Validators.required]],
    duration: [0, [Validators.required]],
  });

  public exercises: Array<any> = [];

  public isPrivate: boolean = false;
  isExerciseFormVisible: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly exerciseService: ExerciseService
  ) {}

  ngOnInit(): void {
    this.fetchExercises().subscribe({
      next: (res: any) => {
        console.log(res);
        this.exercises = res.data;
        this.changeExerciseSelect(res.data[0].uid);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.fetchExerciseTags().subscribe({
      next: (res: any) => {
        console.log("tags", res);
        this.tags = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  public onCreateWorkout(): void {
    console.log(this.createWorkoutForm.value);
  }

  public onAddExercise(): void {
    const addedExercises = this.createWorkoutForm.get('exercises')?.value ?? [];
    this.addExerciseForm.get('rank')?.setValue(addedExercises.length + 1);
    if (this.addExerciseForm.invalid) {
      return;
    }
    // Append exercise to workout exercises
    const currentExercises = this.createWorkoutForm.get(
      'exercises'
    ) as FormControl;
    currentExercises.setValue([
      ...currentExercises.value,
      this.convertExerciseStringFieldsToNumbers(this.addExerciseForm.value),
    ]);
    // Hide form
    this.showExerciseFormPopup = false;
  }

  public onImageUpload(event: Event): void {
    const filesLength = (event?.target as HTMLInputElement).files?.length;
    const file = (event?.target as HTMLInputElement)?.files?.item(
      (filesLength as number) - 1
    );
    const selectedImage = this.createWorkoutForm.get('imageUri') as FormControl;
    selectedImage.setValue(file);
  }

  public onExerciseSelect(event: Event) {
    const selectValue = (event.target as HTMLInputElement).value;
    this.changeExerciseSelect(selectValue);
  }

  public changeExerciseSelect(exerciseId: any): void {
    const currentExerciseId = this.addExerciseForm.get(
      'exerciseId'
    ) as FormControl;
    const currentExerciseTitle = this.addExerciseForm.get(
      'title'
    ) as FormControl;
    const currentExerciseThumb = this.addExerciseForm.get(
      'thumbUri'
    ) as FormControl;

    currentExerciseId.setValue(exerciseId);
    currentExerciseTitle.setValue(
      this.exercises.filter((el) => el.uid == exerciseId).at(0)?.title
    );
    currentExerciseThumb.setValue(
      this.exercises.filter((el) => el.uid == exerciseId).at(0)?.thumbUri
    );
  }

  public onRemoveExercise(exercise: any): void {
    const currentExercises = this.createWorkoutForm.get(
      'exercises'
    ) as FormControl;
    const currentExercisesArr: Array<any> = currentExercises.value ?? [];
    const newExercises = currentExercisesArr.filter(
      (el) => el.exerciseId != exercise?.exerciseId
    );
    currentExercises.setValue(newExercises);
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
  }

  onHasTimingChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.hasTiming = checkbox.checked;
    this.addExerciseForm.get('hasTiming')?.setValue(checkbox.checked);
  }

  private fetchExercises(): Observable<any> {
    return this.exerciseService.getList({
      what: {
        [EXERCISE_FIELDS.exercises.uid]: 1,
        [EXERCISE_FIELDS.exercises.title]: 1,
        [EXERCISE_FIELDS.exercises.thumbUri]: 1,
      },
    });
  }

  private fetchExerciseTags(): Observable<any> {
    return this.exerciseService.getTagList({
      what: {
        [EXERCISE_FIELDS.exercise_tags.uid]: 1,
        [EXERCISE_FIELDS.exercise_tags.name]: 1,
      }
    });
  }

  private convertExerciseStringFieldsToNumbers(exercise: any): void {
    return {
      ...exercise,
      repetitions: +exercise.repetitions,
      duration: +exercise.duration,
    };
  }

  private changeCheckBoxStatuses(isPrivate: boolean): void {
    const isPrivateSelected = this.createWorkoutForm.get(
      'private'
    ) as FormControl;
    const isActiveSelected = this.createWorkoutForm.get(
      'active'
    ) as FormControl;

    if (isPrivate) {
      isPrivateSelected.setValue(true);
      isActiveSelected.setValue(false);
    } else {
      isPrivateSelected.setValue(false);
      isActiveSelected.setValue(true);
    }
  }
}
