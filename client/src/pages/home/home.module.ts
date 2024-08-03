import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './component/home.component';
import { HomeSearchComponent } from '../../features/home/home-search/home-search.component';
import { LoaderModule } from '../../shared/components/loader/loader.module';
import { WorkoutCardModule } from '../../widgets/workout-card/card.module';

@NgModule({
  declarations: [HomeComponent, HomeSearchComponent],
  imports: [SharedModule, HomeRoutingModule, LoaderModule, WorkoutCardModule],
  exports: [HomeComponent],
})
export class HomeModule {}
