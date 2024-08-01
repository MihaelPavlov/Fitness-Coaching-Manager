import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class sessionLeave implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate()
      ? true
      : confirm('Are you sure you want to leave');
  }
}
