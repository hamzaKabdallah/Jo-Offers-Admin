import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IAuthUser } from '../interfaces/auth-user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  user$: BehaviorSubject<IAuthUser | null> =
    new BehaviorSubject<IAuthUser | null>(null);

  constructor() {}

  public getUser(): Observable<IAuthUser | null> {
    const storage = JSON.parse(localStorage.getItem('user') as string);

    if (!storage) {
      return of(null);
    } else {
      this.setUser(storage);
      return of(storage);
    }
  }

  public setUser(v: IAuthUser | null) {
    this.user$.next(v);
    localStorage.setItem('user', JSON.stringify(v));
  }
}
