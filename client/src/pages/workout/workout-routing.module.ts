import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutLibraryComponent } from '../../features/workout/workout-library/worokut-library.component';
import { WorkoutDetailsComponent } from '../../features/workout/workout-details/workout-details.component';

const routes: Routes = [
  {
    path: 'list',
    component: WorkoutLibraryComponent
  },
  {
    path: 'details',
    component: WorkoutDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkoutRoutingModule { }
