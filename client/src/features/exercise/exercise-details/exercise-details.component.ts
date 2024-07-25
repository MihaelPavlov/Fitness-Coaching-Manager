import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../../entities/exercises/services/exercise.service';
import { ActivatedRoute } from '@angular/router';
import { IExercise } from '../../../entities/exercises/models/exercise.interface';
import { take } from 'rxjs';
import { IExerciseTag } from '../../../entities/exercises/models/exercise-tag.interface';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrl: './exercise-details.component.scss',
})
export class ExerciseDetailsComponent implements OnInit {
  exerciseDetails: IExercise | undefined;
  tagIds: number[] | undefined;
  tags:IExerciseTag[] | null = [];
  
  constructor(
    private location: Location,
    private exerciseService: ExerciseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id: number = Number(this.route.snapshot.paramMap.get('exerciseId'));
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
        },
        condition: {
          type: 'AND',
          items: [{
            field:'uid',
            operation:'EQ',
            value:id
          }],
        },
      }).pipe(take(1))
      .subscribe(
        (result) => {
          if (result?.data && result.data.length > 0) {
            console.log(result.data[0]);
            this.exerciseDetails = result.data[0];
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
                  tagColor:1,
                },
                condition: {
                  type: 'OR',
                  items: items,
                },
              })
              .subscribe((res) => {
                this.tags = res?.data || [];
              });
          }
        },
        (error) => {
          console.error('Error fetching exercise details:', error);
        }
      );
  }

  goBack() {
    this.location.back();
  }
}
