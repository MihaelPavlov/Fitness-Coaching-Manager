import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../../../entities/workouts/services/workout.service';
import { BehaviorSubject } from 'rxjs';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';
import { IWorkoutTag } from '../../../entities/workouts/models/workout-tag.interface';
import { IQueryParams } from '../../../entities/models/query-params.interface';

@Component({
  selector: 'app-workout-library',
  templateUrl: './workout-library.component.html',
  styleUrl: './workout-library.component.scss',
})
export class WorkoutLibraryComponent implements OnInit {
  public pageName:string = 'Workouts';
  public workoutsSubject = new BehaviorSubject<IWorkout[]>([]);
  public workouts?: IWorkout[];
  public tags?: IWorkoutTag[];

  public selectedTagsSubject = new BehaviorSubject<IWorkoutTag[]>([]);

  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading: boolean = false;

  constructor(
    private readonly workoutService: WorkoutService
  ) {}

  ngOnInit(): void {
    this.selectedTagsSubject.asObservable().subscribe((selectedTags) => {

    });

    this.isLoadingSubject.asObservable().subscribe(value => this.isLoading = value);

    this.workoutsSubject.asObservable().subscribe((values) => {
      this.workouts = values;
    })

    this.getWorkouts();

    this.getWorkoutTags();
  }

  private getWorkouts() {
    this.isLoadingSubject.next(true);

    const queryParams: IQueryParams = {
      what: {
        title: 1,
        owner: 1,
        tags: 1,
        rating: 1,
        imageUri: 1
      }
    }

    this.workoutService.getWorkouts(queryParams).subscribe({
      next: (res) => {
        console.log(res?.data)
        this.workouts = res?.data;
        this.workoutsSubject.next(this.workouts || []);
      },
      error: (err) => console.log(err),
      complete: () => this.isLoadingSubject.next(false)
    })
  }

  private getWorkoutTags() {
    const queryParams: IQueryParams = {
      what: {
        uid: 1,
        name: 1
      }
    }

    this.workoutService.getWorkoutTags(queryParams).subscribe({
      next: (res) => {
        this.tags = res?.data;
      },
      error: (err) => console.log(err)
    })
  }
}
