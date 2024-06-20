import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseLibraryComponent } from './component/exercise-library.component';
import { ExerciseBuidlerComponent } from '../../features/exercise-library/add-exercise/exercise-builder.component';

const routes: Routes = [
  {
    path: 'list',
    component: ExerciseLibraryComponent
  },
  {
    path: 'create',
    component: ExerciseBuidlerComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExerciseLibraryRoutingModule { }
