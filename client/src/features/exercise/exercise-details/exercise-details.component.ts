import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IExercise } from '../../../entities/exercises/models/exercise.interface';
import { take } from 'rxjs';
import { IExerciseTag } from '../../../entities/exercises/models/exercise-tag.interface';
import { UserService } from '../../../entities/users/services/user.service';
import { UserInfo } from '../../../entities/models/user.interface';
import { SessionService } from '../../../entities/sessions/services/session.service';
import { environment } from '../../../shared/environments/environment.development';
import { IQueryParams } from '../../../entities/models/query-params.interface';
@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrl: './exercise-details.component.scss',
})
export class ExerciseDetailsComponent implements OnInit {
  @Input() showBackBtn: boolean = false;

  public exerciseDetails?: IExercise;
  public sessionExerciseDescription?: string;
  public tagIds: number[] | undefined;
  public tags: IExerciseTag[] | null = [];
  public fullMediaPath: string | undefined;
  public currentUserId: string | undefined;
  public isOwner: boolean = false;
  public sessionExerciseIds: number[] = [];
  public isVideo: boolean = false;

  constructor(
    private location: Location,
    private exerciseService: ExerciseService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    const id: number = Number(this.route.snapshot.paramMap.get('exerciseId'));
    const sessionExerciseId: number = Number(this.route.snapshot.paramMap.get('sessionExerciseId'));
    this.exerciseService
      .getDetails({
        what: {
          uid: 1,
          title: 1,
          thumbUri: 1,
          difficulty: 1,
          equipmentIds: 1,
          description: 1,
          tagIds: 1,
          contributorId: 1,
        },
        condition: {
          type: 'AND',
          items: [
            {
              field: 'uid',
              operation: 'EQ',
              value: id,
            },
          ],
        },
      })
      .pipe(take(1))
      .subscribe(
        (result) => {
          if (result?.data && result.data.length > 0) {
            this.exerciseDetails = result.data[0];
            console.log(result.data);

            if (sessionExerciseId) this.fetchSessionExerciseDescription(sessionExerciseId)

            this.fullMediaPath =
              environment.files + this.exerciseDetails.thumbUri;
            this.isVideo = this.checkIfVideo(this.exerciseDetails.thumbUri);

            this.tagIds = result.data[0].tagIds.split(',').map(Number);

            const items = this.tagIds.map((tagId) => ({
              field: 'uid',
              operation: 'EQ',
              value: tagId,
            }));

            this.exerciseService
              .getTagList({
                what: {
                  name: 1,
                  tagColor: 1,
                },
                condition: {
                  type: 'OR',
                  items: items,
                },
              })
              .subscribe((res) => {
                this.tags = res?.data || [];
              });
            this.fetchUserProfile();
          }
        },
        (error) => {
          console.error('Error fetching exercise details:', error);
        }
      );

    this.sessionService
      .getSessionExercises({
        what: {
          exerciseId: 1,
        },
      })
      .subscribe((result) => {
        if (result?.data && result.data.length > 0) {
          this.sessionExerciseIds = result.data.map(
            (exercise: any) => exercise.exerciseId
          );
        }
      });
  }

  public goBack() {
    this.location.back();
  }

  public navigateToEdit() {
    this.router.navigateByUrl(`exercise/edit/${this.exerciseDetails?.uid}`);
  }

  private fetchSessionExerciseDescription(sessionExerciseId: number) {
    const queryParams: IQueryParams = {
      what: {
        description: 1
      },
      condition: {
        type: "AND",
        items: [
          {
            field: "uid",
            operation: "EQ",
            value: sessionExerciseId
          }
        ]
      }
    }

    this.sessionService.getSessionExercise(queryParams).subscribe({
      next: (res) => {
        if (res?.data[0]?.description && res?.data[0]?.description !== "") this.sessionExerciseDescription = res?.data[0]?.description;
      },
      error: (err) => console.log(err)
    })
  }

  private fetchUserProfile(): void {
    this.userService.userInfo$.subscribe((userInfo: UserInfo | null) => {
      if (userInfo?.contributorId === this.exerciseDetails?.contributorId)
        this.isOwner = true;
    });
  }

  public onDeleteHandler(): void {
    if (
      this.exerciseDetails &&
      this.sessionExerciseIds.includes(this.exerciseDetails.uid)
    ) {
      alert(
        'This exercise cannot be deleted because it is part of a workout session.'
      );
    } else {
      const confirmation = confirm(
        'Are you sure you want to delete this exercise?'
      );
      if (confirmation && this.exerciseDetails) {
        this.exerciseService.delete(this.exerciseDetails.uid).subscribe({
          next: () => {
            this.router.navigate(['/exercise/list']);
          },
          error: (err) => {
            alert(
              `Error deleting exercise: ${
                err.error?.message || 'Unknown error'
              }`
            );
          },
        });
      }
    }
  }

  private checkIfVideo(filePath: string): boolean {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv'];
    const extension = filePath
      .substring(filePath.lastIndexOf('.'))
      .toLowerCase();
    return videoExtensions.includes(extension);
  }
}
