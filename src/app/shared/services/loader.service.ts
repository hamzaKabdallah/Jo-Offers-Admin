import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loader$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  
  public setLoader(value : boolean) {
    this.loader$.next(value);
  }

  public getLoader(): Observable<boolean> {
    return this.loader$.asObservable();
  }
  
  constructor() { }
}
