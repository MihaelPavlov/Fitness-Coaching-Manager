import { Component, OnInit } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { toFormData } from '../../../shared/utils/formTransformer';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { EXERCISE_FIELDS } from '../../../entities/exercises/models/fields/exercise-fields.constant';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { ContributorService } from '../../../entities/contributors/services/contributor.service';
import { Router } from '@angular/router';

interface Tag extends ListItem {
  uid?: number;
  name?: string;
}

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
  public showExerciseFormPopup = false;
  public isLoading: boolean = false;

  public tagsDropdownSettings = {
    singleSelection: false,
    idField: 'uid',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    //allowSearchFilter: true
  };

  public tags: any;
  public subscribers: Array<any> = [];

  public createWorkoutForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    imageUri: [null, [Validators.required]],
    tags: [[], [Validators.required]],
    numberOfSets: ['', [Validators.required]],
    pauseBetweenSets: ['', [Validators.required]],
    pauseBetweenExercises: ['', [Validators.required]],
    active: [0, [Validators.required]],
    private: [0, [Validators.required]],
    relatedStudent: [null],
    exercises: [[], [Validators.required]],
  });

  public createWorkoutErr: string = "";
  public hasCreateWorkoutErr: boolean = false;

  public addExerciseForm = this.fb.group({
    exerciseId: [null, [Validators.required]],
    thumbUri: [''],
    rank: [0, [Validators.required]],
    title: ['', [Validators.required]],
    hasTiming: [0, [Validators.required]],
    description: ['', [Validators.required]],
    repetitions: [0, [Validators.required]],
    duration: [0, [Validators.required]],
  });

  public exercises: Array<any> = [];

  public isPrivate: boolean = false;
  isExerciseFormVisible: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly workoutService: WorkoutService,
    private readonly exerciseService: ExerciseService,
    private readonly contributorService: ContributorService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchExercises();
    this.fetchWorkoutTags();
    this.fetchSubscribers();
  }

  public onCreateWorkout(): void {
    this.isLoading = true;
    if (this.createWorkoutForm.invalid) {
      this.isLoading = false;
      return
    }

    const requestBody = {
      ...this.createWorkoutForm.value,
      tags: this.transformFormTags()
    }
    console.log(requestBody)

    this.workoutService.createWorkout(toFormData(requestBody)).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.hasCreateWorkoutErr = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.hasCreateWorkoutErr = true;
        this.createWorkoutErr = err.error.data.error || "Bad Request";
        console.log("Create workout err", err);
      }
    })
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

  public onTagSelect(item: Tag): void {
    const tagsArr = this.createWorkoutForm.get('tags') as FormControl;
    tagsArr.setValue([...tagsArr.value, item]);
  }

  public onTagSelectAll(items: Tag[]): void {
    const tagsArr = this.createWorkoutForm.get('tags') as FormControl;
    tagsArr.setValue(items);
  }

  public onTagDeselect(item: Tag): void {
    const tagsArr = this.createWorkoutForm.get('tags') as FormControl;
    tagsArr.setValue(tagsArr.value.filter((el: Tag) => el.uid != item.uid));
  }

  public onTagDeselectAll(): void {
    const tagsArr = this.createWorkoutForm.get('tags') as FormControl;
    tagsArr.setValue([]);
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

  public onPrivateChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isPrivate = checkbox.checked;
    this.changeCheckBoxStatuses(this.isPrivate);
  }

  public onActiveChange(event: Event) {
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

  public showExerciseForm() {
    this.showExerciseFormPopup = !this.showExerciseFormPopup;
  }

  public onHasTimingChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.hasTiming = checkbox.checked;
    this.addExerciseForm.get('hasTiming')?.setValue(checkbox.checked ? 1 : 0);
  }

  private transformFormTags() {
    const tags = this.createWorkoutForm.get('tags') as FormControl;
    /* const tagsArr: Array<any> = tags.value || []
    tags.setValue(tagsArr.map((el: any) => el.uid).join(",")) */
    let tagsArr: Array<number | undefined> = [];
    tags.value.forEach((tag: Tag) => tagsArr.push(tag.uid));
    return tagsArr.join(",");
  }

  private fetchExercises() {
    return this.exerciseService
      .getList({
        what: {
          [EXERCISE_FIELDS.exercises.uid]: 1,
          [EXERCISE_FIELDS.exercises.title]: 1,
          [EXERCISE_FIELDS.exercises.thumbUri]: 1,
        },
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.exercises = res.data;
          this.changeExerciseSelect(res.data[0].uid);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private fetchWorkoutTags() {
    return this.workoutService
      .getWorkoutTags({
        what: {
          uid: 1,
          name: 1,
        },
      })
      .subscribe({
        next: (res: any) => {
          console.log('tags', res);
          this.tags = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private fetchSubscribers() {
    this.contributorService
      .getSubscribers({
        what: {
          subscriber: 1,
        },
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.subscribers = res?.data;
        },
        error: (error) => {
          console.log(error);
        },
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
      isPrivateSelected.setValue(1);
      isActiveSelected.setValue(0);
    } else {
      isPrivateSelected.setValue(0);
      isActiveSelected.setValue(1);
    }
  }
}
