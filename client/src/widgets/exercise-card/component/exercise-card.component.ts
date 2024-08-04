import {
  Component,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';
import { IExercise } from '../../../entities/exercises/models/exercise.interface';
import { Router } from '@angular/router';
import { IExerciseTag } from '../../../entities/exercises/models/exercise-tag.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-exercise-card',
  templateUrl: './exercise-card.component.html',
  styleUrls: ['./exercise-card.component.scss'],
})
export class ExerciseCardComponent implements OnChanges {
  @HostListener('window:resize', ['$event'])
  public onResize(event?: any): void {
    this.screenWidthSubject.next(window.innerWidth);
  }
  @Input()
  exercise!: IExercise;
  @Input() tags!: IExerciseTag[];

  public parsedTags!: any;
  public screenWidthSubject = new BehaviorSubject<number>(0);

  constructor(private readonly router: Router) {
    this.onResize();
  }

  public ngOnChanges(): void {
    this.displayTags();
  }

  public displayTags(): void {
    this.screenWidthSubject.subscribe((screenWidth) => {
      let showTagsCount = screenWidth > 700 ? 2 : 1;
      let truncateStringLength = screenWidth > 700 ? 12 : 17;

      if (this.tags.length <= showTagsCount)
        return (this.parsedTags = this.tags);

      let newTags = [];

      for (let i = 0; i < showTagsCount; i++) {
        let currentTag = this.tags[i];
        if (currentTag.name.length > truncateStringLength) {
          currentTag.name =
            currentTag.name.substring(0, truncateStringLength - 2) + '...';
        }
        newTags.push(currentTag);
      }

      return (this.parsedTags = [
        ...newTags,
        { name: `${this.tags.length - showTagsCount}...` },
      ]);
    });
  }

  public navigateToDetails(id: number): void {
    this.router.navigateByUrl(`exercise/details/${id}`);
  }
}
