import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseLibraryComponent } from './component/exercise-library.component';

const routes: Routes = [
  {
    path: '',
    component: ExerciseLibraryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExerciseLibraryRoutingModule { }
