import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() toggleFilterForm: boolean = false;

  public filterHandler(): void {
    this.toggleFilterForm = !this.toggleFilterForm;
  }
}
