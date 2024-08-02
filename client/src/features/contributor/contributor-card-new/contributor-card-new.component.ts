import { Component, Input } from '@angular/core';
import { IContributor } from '../../../entities/contributors/models/contributors.interface';

@Component({
  selector: 'app-contributor-card-new',
  templateUrl: './contributor-card-new.component.html',
  styleUrl: './contributor-card-new.component.scss',
})
export class ContributorCardNewComponent {
  @Input() contributor?: IContributor
}
