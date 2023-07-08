import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserStoreService } from './shared/services/user-store.service';
import { of, Observable } from 'rxjs';
import { LoaderService } from './shared/services/loader.service';
import { ToolbarService } from './shared/services/toolbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private auth: Auth = inject(Auth);
  title = 'ofersadmin';
  user: boolean;
  email!: string | null; // to be delete
  isShowSpinner: Observable<boolean> = of(false);
  isShowToolbar: Observable<boolean> = of(false);

  /**
   *
   */
  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private userStoreService: UserStoreService,
    protected loaderService: LoaderService,
    protected toolBarService: ToolbarService
  ) {
    this.isShowToolbar = this.toolBarService.getShowToolbar();
    this.authStatusListener();

    this.user = !!this.auth.currentUser;
  }

  authStatusListener() {
    this.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.email = user.email;
        console.log(user);
        this.user = true;
        console.log('User is logged in');
      } else {
        this.user = false;
        console.log('User is logged out');
      }
    });
  }

  logout(): void {
    this.loaderService.setLoader(true);
    this.auth
      .signOut()
      .then((value) => {
        this.toolBarService.setShowToolbar(false);
        this.router.navigate(['auth/login']);
        this.userStoreService.setUser(null);
      })
      .finally(() => this.loaderService.setLoader(false));
  }
}
