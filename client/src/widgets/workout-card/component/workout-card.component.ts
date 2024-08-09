import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { IWorkout } from '../../../entities/workouts/models/workout.interface';
import { Router } from '@angular/router';
import { UserService } from '../../../entities/users/services/user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { IUserWorkout } from '../../../entities/users/models/user-workout.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-workout-card',
  templateUrl: './workout-card.component.html',
  styleUrls: ['./workout-card.component.scss'],
})
export class WorkoutCardComponent implements OnChanges {
  @HostListener('window:resize', ['$event'])
  public onResize(event?: any) {
    this.screenWidthSubject.next(window.innerWidth);
  }

  @Input() workout!: IWorkout;
  @Input() userWorkouts: IUserWorkout[] = [];
  @Output() onItemRemoved: EventEmitter<void> = new EventEmitter<void>();

  public tags: any;
  public screenWidthSubject = new BehaviorSubject<number>(0);
  public isCardAdded: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {
    this.onResize();
  }

  public get canUserAddCard(): boolean {
    return this.userService.getUser?.role === UserRoles.User;
  }

  public ngOnChanges(): void {
    if (this.workout && this.userWorkouts) {
      this.isCardAdded = this.userWorkouts.some(
        (x) => x.workoutSessionId === this.workout.uid
      );
      this.displayTags();
    }
  }

  public displayTags(): void {
    this.screenWidthSubject.subscribe((screenWidth) => {
      let showTagsCount = screenWidth > 700 ? 2 : 1;
      let truncateStringLength = screenWidth > 700 ? 10 : 17;

      if (this.workout.tags && this.workout.tags.length <= showTagsCount)
        return (this.tags = this.workout.tags);

      let newTags = [];

      if (this.workout.tags) {
        for (let i = 0; i < showTagsCount; i++) {
          let currentTag = this.workout.tags[i];
          if (currentTag.name.length > truncateStringLength)
            currentTag.name =
              currentTag.name.substring(0, truncateStringLength - 2) + '...';
          newTags.push(currentTag);
        }
      }

      return (this.tags = [
        ...newTags,
        {
          name: `${
            (this.workout.tags ? this.workout.tags.length : 0) - showTagsCount
          }...`,
        },
      ]);
    });
  }

  public navigateToWorkout(): void {
    this.router.navigate([`/workout/details/${this.workout.uid}`]);
  }

  public starsCount(): Array<any> {
    if (this.workout?.rating === 0) return Array(1).fill(0);
    return Array(this.workout?.rating).fill(0);
  }

  public onAdd(): void {
    if (this.workout.uid) {
      this.userService.addToCollection(this.workout.uid).subscribe();
      this.isCardAdded = true;
    }
  }

  public onRemove(): void {
    if (this.workout.uid) {
      this.userService.removeFromCollection(this.workout.uid).subscribe((x) => {
        this.isCardAdded = false;
        this.onItemRemoved.emit();
      });
    }
  }
}
