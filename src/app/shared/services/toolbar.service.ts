import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  private showToolBar$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  setShowToolbar(val: boolean) {
    this.showToolBar$.next(val);
  }

  getShowToolbar(): Observable<boolean> {
    return this.showToolBar$.asObservable();
  }
}
