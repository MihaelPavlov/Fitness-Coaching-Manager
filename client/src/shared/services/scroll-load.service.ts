import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IRequestResult } from '../../entities/models/request-result.interface';

@Injectable({
  providedIn: 'root',
})
export class LazyLoadService<T> {
  private items: T[] = [];
  public itemsSubject = new BehaviorSubject<T[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private destroyRef = new Subject<void>();

  private currentPage = 0;
  private limit = 20;
  private allItemsLoaded = false;

  private fetchFunction!: (
    page: number,
    limit: number
  ) => Observable<IRequestResult<T[]> | null>;

  constructor() {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  public initialize(
    fetchFunction: (
      page: number,
      limit: number
    ) => Observable<IRequestResult<T[]> | null>,
    limit: number = 20
  ): void {
    this.limit = limit;
    this.fetchFunction = fetchFunction;
    this.loadInitialItems();
  }

  private getItems(page: number = 0): void {
    this.isLoadingSubject.next(true);

    this.fetchFunction(page, this.limit)
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) {
            if (result.data.length < this.limit) this.allItemsLoaded = true;
            this.items = [...this.items, ...result?.data];
            this.itemsSubject.next(this.items);
          }
        },
        error: (err) => console.log(err),
        complete: () => this.isLoadingSubject.next(false),
      });
  }

  private onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.allItemsLoaded
    ) {
      this.currentPage++;
      this.getItems(this.currentPage);
    }
  }

  public loadInitialItems() {
    this.currentPage = 0;
    this.items = [];
    this.allItemsLoaded = false;
    this.getItems();
  }

  public ngOnDestroy() {
    this.destroyRef.next();
    this.destroyRef.complete();
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  public getItemsObservable() {
    return this.itemsSubject.asObservable();
  }

  public getLoadingObservable() {
    return this.isLoadingSubject.asObservable();
  }
}
