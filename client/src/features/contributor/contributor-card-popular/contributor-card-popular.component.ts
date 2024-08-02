import { Component, Input } from '@angular/core';
import { IContributor } from '../../../entities/contributors/models/contributors.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contributor-card-popular',
  templateUrl: './contributor-card-popular.component.html',
  styleUrl: './contributor-card-popular.component.scss',
})
export class ContributorCardPopularComponent {
  @Input() contributor?: IContributor;

  constructor(
    private readonly router: Router
  ) {}

  public navigateToContributor() {
    this.router.navigate([`/profile/${this.contributor?.userId}`]);
  }
}
