import { NgModule } from '@angular/core';
import { ExerciseLibraryComponent } from '../../features/exercise/exercise-library/exercise-library.component';
import { ExerciseRoutingModule } from './exercise-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SearchModule } from '../../widgets/search/search.module';
import { ExerciseCardModule } from '../../widgets/exercise-card/exercise-card.module';
import { ExerciseDetailsComponent } from '../../features/exercise/exercise-details/exercise-details.component';
import { TagModule } from '../../widgets/tag/tag.module';
import { ExerciseBuidlerComponent } from '../../features/exercise/exercise-builder/exercise-builder.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ExerciseLibraryComponent,ExerciseBuidlerComponent,ExerciseDetailsComponent],
  imports: [
    SharedModule,
    ExerciseRoutingModule,
    SearchModule,
    ExerciseCardModule,
    TagModule,
    ReactiveFormsModule
  ],
  exports: [ExerciseLibraryComponent],
})
export class ExerciseModule {}
