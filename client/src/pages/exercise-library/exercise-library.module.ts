import { NgModule } from '@angular/core';
import { ExerciseLibraryComponent } from './component/exercise-library.component';
import { ExerciseLibraryRoutingModule } from './exercise-library-routing.module';
import { ExerciseLibrarySearchComponent } from '../../features/exercise-library-search/component/exercise-library-search/exercise-library-search.component';
import { ExerciseListComponent } from '../../features/exercise-list/component/exercise-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ExerciseLibraryComponent,
    ExerciseLibrarySearchComponent,
    ExerciseListComponent,
  ],
  imports: [SharedModule, ExerciseLibraryRoutingModule],
  exports: [ExerciseLibraryComponent],
})
export class ExerciseLibraryModule {}
