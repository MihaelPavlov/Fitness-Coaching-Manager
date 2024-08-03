import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutLibraryComponent } from '../../features/workout/workout-library/workout-library.component';
import { WorkoutDetailsComponent } from '../../features/workout/workout-details/workout-details.component';
import { WorkoutSessionComponent } from '../../features/workout/workout-session/workout-session.component';
import { WorkoutBuilderComponent } from '../../features/workout/workout-builder/workout-builder.component';
import { sessionLeave } from '../../shared/guards/sessionLeave.guard';
import { CoachOnlyGuard } from '../../shared/guards/coach-only.guard';

const routes: Routes = [
  {
    path: 'list',
    component: WorkoutLibraryComponent,
  },
  {
    path: 'details/:workoutId',
    component: WorkoutDetailsComponent,
  },
  {
    path: 'session/:workoutId',
    component: WorkoutSessionComponent,
    canDeactivate: [sessionLeave]
  },
  {
    path: 'create',
    canActivate: [CoachOnlyGuard],
    component: WorkoutBuilderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutRoutingModule {}
