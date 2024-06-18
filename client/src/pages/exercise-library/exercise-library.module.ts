import { NgModule } from '@angular/core';
import { ExerciseLibraryComponent } from './component/exercise-library.component';
import { ExerciseLibraryRoutingModule } from './exercise-library-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SearchModule } from '../../widgets/search/search.module';
import { ExerciseCardModule } from '../../widgets/exercise-card/exercise-card.module';

@NgModule({
  declarations: [ExerciseLibraryComponent],
  imports: [
    SharedModule,
    ExerciseLibraryRoutingModule,
    SearchModule,
    ExerciseCardModule,
    
  ],
  exports: [ExerciseLibraryComponent],
})
export class ExerciseLibraryModule {}
