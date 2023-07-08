import { OnInit, Component, inject, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { finalize, Observable, Subscription, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStoreService } from 'src/app/shared/services/user-store.service';
import {
  collection,
  collectionData,
  Firestore,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { IAuthUser } from 'src/app/shared/interfaces/auth-user.interface';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private auth: Auth = inject(Auth);
  private subs!: Subscription;

  protected form!: FormGroup<{
    password: FormControl<string>;
    email: FormControl<string>;
  }>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private UserStoreService: UserStoreService,
    private firestore: Firestore,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    protected toolBarService: ToolbarService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();

    // to set the email to form when user change his password
    this.subs = this.route.queryParams.subscribe((params) => {
      if (!params['email']) {
        return;
      }

      this.form.controls.email.setValue(params['email']);
    });
  }

  initForm() {
    this.form = this.fb.nonNullable.group({
      password: this.fb.nonNullable.control('password', [
        Validators.required,
        Validators.minLength(6),
      ]),
      email: this.fb.nonNullable.control('hamza.air267@gmail.com', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  async submit() {
    if (this.form.invalid) {
      return;
    }

    const { password, email } = this.form.value;

    this.loaderService.setLoader(true);
    const login = await signInWithEmailAndPassword(
      this.auth,
      email as string,
      password as string
    ).finally(() => this.loaderService.setLoader(false));
    this.toolBarService.setShowToolbar(true);

    const userDocRef = doc(this.firestore, 'users', login.user.uid);

    try {
      const docSnap = await getDoc(userDocRef);
      console.log('docSnap.data()', docSnap.data());

      this.UserStoreService.setUser((docSnap.data() as IAuthUser) || null);
      const path = `auth/${
        (docSnap.data() as IAuthUser)?.role ? 'admin-dashboard' : 'dashboard'
      }`;
      this.router.navigate([path]);
    } catch (error) {
      console.log(error);
      console.log('user unregister correctly');
    }

    // const collectionStore = collection(this.firestore, 'users');

    // console.log({ collectionStore });
    // this.loaderService.setLoader(true);
    // (
    //   collectionData(collectionStore) as unknown as Observable<IAuthUser[]>
    // ).pipe(
    //   take(1),
    //   finalize(() => {
    //     this.loaderService.setLoader(false);
    //   })
    // )
    // .subscribe((usersCollection) => {
    //   const userRecord = usersCollection.find(
    //     (user) => user.email === login.user.email
    //   );

    //   if (!userRecord) {
    //     console.log('user unregister correctly');

    //     return;
    //   }

    //   this.UserStoreService.setUser(userRecord || null);
    //   const path = `auth/${userRecord?.role ? 'admin-dashboard' : 'dashboard'}`;
    //   this.router.navigate([path]);
    // });
  }
}
