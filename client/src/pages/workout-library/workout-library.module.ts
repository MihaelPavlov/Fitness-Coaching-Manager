import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WorkoutLibraryRoutingModule } from './workout-library-routing.module';
import { WorkoutLibraryComponent } from './component/workout-library.component';
import { SearchModule } from '../../widgets/search/search.module';
import { WorkoutCardModule } from '../../widgets/workout-card/card.module';

@NgModule({
  declarations: [WorkoutLibraryComponent],
  imports: [
    SharedModule,
    WorkoutLibraryRoutingModule,
    SearchModule,
    WorkoutCardModule,
  ],
  exports: [WorkoutLibraryComponent],
})
export class WorkoutLibraryModule {}
