import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WorkoutRoutingModule } from './workout-routing.module';
import { WorkoutComponent } from './component/workout.component';
import { SearchModule } from '../../widgets/search/search.module';
import { WorkoutCardModule } from '../../widgets/workout-card/card.module';
import { WorkoutLibraryComponent } from '../../features/workout/workout-library/worokut-library.component';
import { WorkoutDetailsComponent } from '../../features/workout/workout-details/workout-details.component';
import { ExerciseSetCardModule } from '../../widgets/exercise-set-card/exercise-set-card.module';
import { WorkoutSessionComponent } from '../../features/workout/workout-session/workout-session.component';
import { CircleModule } from '../../widgets/circle/circle.module';
import { WorkoutBuilderComponent } from '../../features/workout/workout-builder/workout-builder.component';
import { WorkoutEditCardModule } from '../../widgets/workout-edit-card/workout-edit-card.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoaderModule } from '../../shared/components/loader/loader.module';

@NgModule({
  declarations: [
    WorkoutComponent,
    WorkoutLibraryComponent,
    WorkoutDetailsComponent,
    WorkoutSessionComponent,
    WorkoutBuilderComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    WorkoutRoutingModule,
    SearchModule,
    WorkoutCardModule,
    ExerciseSetCardModule,
    CircleModule,
    WorkoutEditCardModule,
    NgMultiSelectDropDownModule,
    LoaderModule
  ],
  exports: [WorkoutComponent],
})
export class WorkoutModule {}
