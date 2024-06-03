import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseLibraryComponent } from './component/exercise-library.component';
import { ExerciseLibrarySearchModule } from '../../widgets/exercise-library-search/exercise-library-search.module';
import { ExerciseListModule } from '../../features/exercise-list/exercise-list.module';

@NgModule({
  declarations: [ExerciseLibraryComponent],
  imports: [
    CommonModule,
    ExerciseLibrarySearchModule,
    ExerciseListModule
  ],
  exports: [
    ExerciseLibraryComponent,
  ]
})

export class ExerciseLibraryModule { }
