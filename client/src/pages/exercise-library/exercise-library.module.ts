import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseLibraryComponent } from './component/exercise-library.component';
import { ExerciseLibrarySearchModule } from '../../widgets/exercise-library-search/exercise-library-search.module';

@NgModule({
  declarations: [ExerciseLibraryComponent],
  imports: [
    CommonModule,
    ExerciseLibrarySearchModule
  ],
  exports: [
    ExerciseLibraryComponent
  ]
})

export class ExerciseLibraryModule { }
