import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ContributorRoutingModule } from './contributor-routing.module';
import { ContributorLibraryComponent } from '../../features/contributor/contributor-library/contributor-library.component';
import { ContributorCardNewComponent } from '../../features/contributor/contributor-card-new/contributor-card-new.component';
import { TagModule } from '../../widgets/tag/tag.module';
import { ContributorCardPopularComponent } from '../../features/contributor/contributor-card-popular/contributor-card-popular.component';

@NgModule({
  declarations: [ContributorLibraryComponent,ContributorCardNewComponent,ContributorCardPopularComponent],
  imports: [
    SharedModule,
    ContributorRoutingModule,
    TagModule
  ],
  exports: [],
})
export class ContributorModule {}
