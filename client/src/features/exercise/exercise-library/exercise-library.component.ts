import { Component, Input, OnInit } from '@angular/core';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { IExercise } from '../../../entities/exercises/models/exercise.interface';
import { EXERCISE_FIELDS } from '../../../entities/exercises/models/fields/exercise-fields.constant';
import { IRequestResult } from '../../../entities/models/request-result.interface';
import { IExerciseTag } from '../../../entities/exercises/models/exercise-tag.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LazyLoadService } from '../../../shared/services/scroll-load.service';

@Component({
  selector: 'app-exercise-library',
  templateUrl: './exercise-library.component.html',
  styleUrl: './exercise-library.component.scss',
})
export class ExerciseLibraryComponent implements OnInit {
  @Input() pageName: string = 'Exercises';

  public items$ = this.lazyLoadService.getItemsObservable();
  public itemsSubject = this.lazyLoadService.itemsSubject;
  public tags: IExerciseTag[] = [];

  public selectedTagsSubject = new BehaviorSubject<IExerciseTag[]>([]);

  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading: boolean = false;

  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly lazyLoadService: LazyLoadService<IExercise>
  ) {}

  public ngOnInit(): void {
    this.selectedTagsSubject.asObservable().subscribe((selectedTags) => {
      this.itemsSubject.asObservable().subscribe((exercises) => {
        this.items$ = of(
          exercises.filter((exercise) => {
            let result = false;
            if (selectedTags.length == 0) return true;
            selectedTags.forEach((selectedTag) => {
              if (exercise.tagIds.split(',').includes(selectedTag.uid + '')) {
                result = true;
              }
            });
            return result;
          })
        );
      });
    });

    this.isLoadingSubject
      .asObservable()
      .subscribe((value) => (this.isLoading = value));

    this.itemsSubject.asObservable().subscribe((values) => {
      this.items$ = of(values);
    });

    this.getExercises();

    this.getTagsList();
  }

  public getExercises(): void {
    this.isLoadingSubject.next(true);

    const fetchExercises = (
      page: number,
      limit: number
    ): Observable<IRequestResult<IExercise[]> | null> => {
      const queryParamsGetList: IQueryParams = {
        what: {
          [EXERCISE_FIELDS.exercises.uid]: 1,
          [EXERCISE_FIELDS.exercises.title]: 1,
          [EXERCISE_FIELDS.exercises.description]: 1,
          [EXERCISE_FIELDS.exercises.tagIds]: 1,
          [EXERCISE_FIELDS.exercises.equipmentIds]: 1,
          [EXERCISE_FIELDS.exercises.dateCreated]: 1,
          [EXERCISE_FIELDS.exercises.thumbUri]: 1,
        },
        limit: limit,
        offset: page * limit,
      };
      return this.exerciseService.getList(queryParamsGetList);
    };

    this.lazyLoadService.initialize(fetchExercises, 15);
  }

  public getTagsList() {
    this.isLoadingSubject.next(true);
    const queryParamsGetTagList: IQueryParams = {
      what: {
        [EXERCISE_FIELDS.exercise_tags.uid]: 1,
        [EXERCISE_FIELDS.exercise_tags.name]: 1,
      },
    };

    this.exerciseService.getTagList(queryParamsGetTagList).subscribe({
      next: (tags: IRequestResult<IExerciseTag[]> | null) => {
        console.log(tags?.data);
        this.tags = tags?.data ?? [];
      },
      error: (err) => console.log(err),
      complete: () => this.isLoadingSubject.next(false),
    });
  }

  public getExerciseTags(tagIds: string): IExerciseTag[] {
    if (tagIds) {
      const exerciseTags = tagIds.split(',');
      return this.tags.filter((x) => exerciseTags.includes(x.uid.toString()));
    }
    return [];
  }
}
