import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseLibraryComponent } from './component/exercise-library.component';
import { ExerciseLibrarySearchModule } from '../../features/exercise-library-search/exercise-library-search.module';
import { ExerciseListModule } from '../../features/exercise-list/exercise-list.module';
import { ExerciseLibraryRoutingModule } from './exercise-library-routing.module';

@NgModule({
  declarations: [ExerciseLibraryComponent],
  imports: [
    CommonModule,
    ExerciseLibrarySearchModule,
    ExerciseListModule,
    ExerciseLibraryRoutingModule
  ],
  exports: [
    ExerciseLibraryComponent,
  ]
})

export class ExerciseLibraryModule { }
