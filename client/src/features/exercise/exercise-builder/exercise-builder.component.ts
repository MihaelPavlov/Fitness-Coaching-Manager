import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InputType } from '../../../shared/enums/input-types.enum';
import { optionArrays } from '../../../shared/option-arrays';
import { FormBuilder, Validators } from '@angular/forms';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { Router } from '@angular/router';
import { difficultyList } from '../../../shared/option-arrays/difficulty-list';

@Component({
  selector: 'app-exercise-builder',
  templateUrl: './exercise-builder.component.html',
  styleUrl: './exercise-builder.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ExerciseBuidlerComponent implements OnInit {
  public InputType = InputType;
  public isLoading: boolean = false;
  public optionArrays = optionArrays;
  protected hasExerciseError: boolean = false;
  protected createExerciseErrorMsg: string = '';

  protected difficultyArr = Object.entries(difficultyList);

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

  ngOnInit(): void {
    this.exerciseService.getEquipmentList({
      what: {
        uid: 1,
        name: 1,
      },
    });
  }

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
        this.createExerciseErrorMsg = err.error.data[0].message;
        this.hasExerciseError = true;
      },
    });
  }
}
