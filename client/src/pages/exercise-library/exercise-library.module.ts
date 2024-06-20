import { NgModule } from '@angular/core';
import { ExerciseLibraryComponent } from './component/exercise-library.component';
import { ExerciseLibraryRoutingModule } from './exercise-library-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SearchModule } from '../../widgets/search/search.module';
import { ExerciseCardModule } from '../../widgets/exercise-card/exercise-card.module';
import { ButtonModule } from '../../widgets/button/button.module';
import { InputModule } from '../../widgets/input/input.module';
import { ExerciseBuidlerComponent } from '../../features/exercise-library/add-exercise/exercise-builder.component';
import { SelectModule } from '../../widgets/select/select.module';

@NgModule({
  declarations: [ExerciseLibraryComponent,ExerciseBuidlerComponent],
  imports: [
    SharedModule,
    ExerciseLibraryRoutingModule,
    SearchModule,
    ExerciseCardModule,
    ButtonModule,
    InputModule,
    SelectModule
  ],
  exports: [ExerciseLibraryComponent],
})
export class ExerciseLibraryModule {}
