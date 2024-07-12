import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContributorLibraryComponent } from '../../features/contributor/contributor-library/contributor-library.component';

const routes: Routes = [
  {
    path: 'list',
    component: ContributorLibraryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributorRoutingModule { }
