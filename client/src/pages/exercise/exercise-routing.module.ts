import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseLibraryComponent } from '../../features/exercise/exercise-library/exercise-library.component';
import { ExerciseDetailsComponent } from '../../features/exercise/exercise-details/exercise-details.component';
import { ExerciseBuidlerComponent } from '../../features/exercise/exercise-builder/exercise-builder.component';
import { CoachOnlyGuard } from '../../shared/guards/coach-only.guard';

const routes: Routes = [
  {
    path: 'list',
    component: ExerciseLibraryComponent,
  },
  {
    path: 'details/:exerciseId',
    component: ExerciseDetailsComponent,
  },
  {
    path: 'create',
    canActivate: [CoachOnlyGuard],
    component: ExerciseBuidlerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseRoutingModule {}
