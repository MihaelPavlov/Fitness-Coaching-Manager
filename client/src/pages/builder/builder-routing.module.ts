import { RouterModule, Routes } from '@angular/router';
import { BuilderComponent } from './component/builder.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: BuilderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuilderRoutingModule {}
