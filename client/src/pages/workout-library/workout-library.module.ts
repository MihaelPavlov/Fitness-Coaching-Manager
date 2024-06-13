import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WorkoutLibraryRoutingModule } from './workout-library-routing.module';
import { WorkoutLibraryComponent } from './component/workout-library.component';
import { SearchModule } from '../../widgets/search/search.module';
import { CardModule } from '../../widgets/card/card.module';

@NgModule({
  declarations: [WorkoutLibraryComponent],
  imports: [
    SharedModule,
    WorkoutLibraryRoutingModule,
    SearchModule,
    CardModule,
  ],
  exports: [WorkoutLibraryComponent],
})
export class WorkoutLibraryModule {}
