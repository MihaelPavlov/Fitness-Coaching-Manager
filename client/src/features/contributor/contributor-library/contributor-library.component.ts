import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { IContributor } from '../../../entities/contributors/models/contributors.interface';
import { IQueryParams } from '../../../entities/models/query-params.interface';
import { ContributorService } from '../../../entities/contributors/services/contributor.service';

@Component({
  selector: 'app-contributor-library',
  templateUrl: './contributor-library.component.html',
  styleUrls: ['./contributor-library.component.scss'],
})
export class ContributorLibraryComponent implements AfterViewInit, OnInit {
  public pageName: string = 'Contributors';
  @ViewChild('cardsContainer', { static: false }) cardsContainer!: ElementRef;

  public newContributors: IContributor[] = [];
  public popularContributors: IContributor[] = [];

  public cards = Array(20).fill(0);

  public scrollAmount = 300;

  constructor(
    private readonly contributorService: ContributorService
  ) {}

  ngOnInit(): void {
    this.fetchNewContributors();
    this.fetchPopularContributors();
  }

  ngAfterViewInit(): void {
    if (!this.cardsContainer) {
      throw new Error('Cards container not initialized');
    }
  }

  public scrollLeft(): void {
    this.cardsContainer.nativeElement.scrollBy({
      left: -this.scrollAmount,
      behavior: 'smooth',
    });
  }

  public scrollRight(): void {
    this.cardsContainer.nativeElement.scrollBy({
      left: this.scrollAmount,
      behavior: 'smooth',
    });
  }

  private fetchNewContributors() {
    const queryParams: IQueryParams = {
      what: {
        contributorId: 1,
        userId: 1,
        rating: 1,
      },
      order: [],
    };

    this.contributorService.getContributors(queryParams).subscribe({
      next: (res) => {
        console.log("new contriburors", res?.data);
        this.newContributors = res?.data || [];
      },
      error: (err) => console.log(err)
    })
  }

  private fetchPopularContributors() {
    const queryParams: IQueryParams = {
      what: {
        contributorId: 1,
        userId: 1,
        rating: 1,
      },
    };

    this.contributorService.getContributors(queryParams).subscribe({
      next: (res) => {
        console.log("popular contriburors", res?.data);
        this.popularContributors = res?.data || [];
      },
      error: (err) => console.log(err)
    })
  }
}
