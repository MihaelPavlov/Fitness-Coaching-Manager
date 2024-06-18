import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkoutLibraryComponent } from './component/workout-library.component';

const routes: Routes = [
  {
    path: 'list',
    component: WorkoutLibraryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkoutLibraryRoutingModule { }
