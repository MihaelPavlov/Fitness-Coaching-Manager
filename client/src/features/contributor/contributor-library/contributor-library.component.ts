import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-contributor-library',
  templateUrl: './contributor-library.component.html',
  styleUrls: ['./contributor-library.component.scss']
})
export class ContributorLibraryComponent implements AfterViewInit {
  pageName:string = 'Contributors'
  @ViewChild('cardsContainer', { static: false }) cardsContainer!: ElementRef;

  cards = Array(20).fill(0); 

  scrollAmount = 300; 

  ngAfterViewInit(): void {
    if (!this.cardsContainer) {
      throw new Error('Cards container not initialized');
    }
  }

  scrollLeft(): void {
    this.cardsContainer.nativeElement.scrollBy({
      left: -this.scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollRight(): void {
    this.cardsContainer.nativeElement.scrollBy({
      left: this.scrollAmount,
      behavior: 'smooth'
    });
  }
}
