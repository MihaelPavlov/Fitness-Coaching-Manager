import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutLibraryComponent } from '../../features/workout/workout-library/worokut-library.component';
import { WorkoutDetailsComponent } from '../../features/workout/workout-details/workout-details.component';
import { WorkoutSessionComponent } from '../../features/workout/workout-session/workout-session.component';
import { WorkoutBuilderComponent } from '../../features/workout/workout-builder/workout-builder.component';

const routes: Routes = [
  {
    path: 'list',
    component: WorkoutLibraryComponent,
  },
  {
    path: 'details',
    component: WorkoutDetailsComponent,
  },
  {
    path: 'session/:workoutId',
    component: WorkoutSessionComponent,
  },
  {
    path: 'create',
    component: WorkoutBuilderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutRoutingModule {}
