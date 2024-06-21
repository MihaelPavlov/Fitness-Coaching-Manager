import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WorkoutRoutingModule } from './workout-routing.module';
import { WorkoutComponent } from './component/workout.component';
import { SearchModule } from '../../widgets/search/search.module';
import { WorkoutCardModule } from '../../widgets/workout-card/card.module';
import { WorkoutLibraryComponent } from '../../features/workout/workout-library/worokut-library.component';
import { WorkoutDetailsComponent } from '../../features/workout/workout-details/workout-details.component';
import { ButtonModule } from '../../widgets/button/button.module';
import { ExerciseSetCardModule } from '../../widgets/exercise-set-card/exercise-set-card.module';

@NgModule({
  declarations: [WorkoutComponent,WorkoutLibraryComponent,WorkoutDetailsComponent],
  imports: [
    SharedModule,
    WorkoutRoutingModule,
    SearchModule,
    WorkoutCardModule,
    ButtonModule,
    ExerciseSetCardModule
  ],
  exports: [WorkoutComponent],
})
export class WorkoutModule {}
