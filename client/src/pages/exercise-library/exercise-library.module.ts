import { NgModule } from '@angular/core';
import { ExerciseLibraryComponent } from './component/exercise-library.component';
import { ExerciseLibraryRoutingModule } from './exercise-library-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SearchModule } from '../../widgets/search/search.module';
import { ExerciseCardModule } from '../../widgets/exercise-card/exercise-card.module';
import { ExerciseDetailsComponent } from '../../features/exercise-details/component/exercise-details/exercise-details.component';
import { TagModule } from '../../widgets/tag/tag.module';
import { ExerciseBuidlerComponent } from '../../features/exercise-library/add-exercise/exercise-builder.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ExerciseLibraryComponent,ExerciseBuidlerComponent,ExerciseDetailsComponent],
  imports: [
    SharedModule,
    ExerciseLibraryRoutingModule,
    SearchModule,
    ExerciseCardModule,
    TagModule,
    ReactiveFormsModule
  ],
  exports: [ExerciseLibraryComponent],
})
export class ExerciseLibraryModule {}
