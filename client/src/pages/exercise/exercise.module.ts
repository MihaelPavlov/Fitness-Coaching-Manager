import { NgModule } from '@angular/core';
import { ExerciseLibraryComponent } from '../../features/exercise/exercise-library/exercise-library.component';
import { ExerciseRoutingModule } from './exercise-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ExerciseCardModule } from '../../widgets/exercise-card/exercise-card.module';
import { ExerciseDetailsComponent } from '../../features/exercise/exercise-details/exercise-details.component';
import { TagModule } from '../../widgets/tag/tag.module';
import { ExerciseBuidlerComponent } from '../../features/exercise/exercise-builder/exercise-builder.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../shared/components/loader/loader.module';
import { ErrorModule } from '../../shared/components/error/error.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ExerciseSearchModule } from '../../widgets/exercise-search/exercise-search.module';

@NgModule({
  declarations: [
    ExerciseLibraryComponent,
    ExerciseBuidlerComponent,
    ExerciseDetailsComponent,
  ],
  imports: [
    SharedModule,
    ExerciseRoutingModule,
    ExerciseSearchModule,
    ExerciseCardModule,
    TagModule,
    ReactiveFormsModule,
    LoaderModule,
    ErrorModule,
    NgMultiSelectDropDownModule,
  ],
  exports: [ExerciseLibraryComponent],
})
export class ExerciseModule {}
