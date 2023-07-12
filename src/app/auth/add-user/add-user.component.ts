import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { INewUser } from 'src/app/shared/interfaces/new-user.interface';
import {
  Firestore,
  collectionData,
  collection,
} from '@angular/fire/firestore';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth'
import { Observable } from '@firebase/util';
import { IBank } from 'src/app/shared/interfaces/banks.interface';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  protected form!: FormGroup<INewUser>;

  protected banks!: IBank[];
  protected roles = [0, 1];

  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private firestore: Firestore,
    private auth: Auth,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      name: this.fb.nonNullable.control('', [Validators.required]),
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
      role: this.fb.nonNullable.control(0, [Validators.required]),
      bank: this.fb.nonNullable.control('', [Validators.required]),
      bankName: this.fb.nonNullable.control('', [Validators.required]),
    });

    this.setBanks();
    this.changes();
  }
  changes() {
    this.form.controls.bank.valueChanges.subscribe(bankId => {
      const bank = this.banks.find(bank => bank.id === bankId);

      this.form.controls.bankName.setValue(bank?.fullName || '');
    })
  }

  createUser(): void {
    if (this.form.invalid) {
      return;
    }

    const user = { ...this.form.value, }
    this.loaderService.setLoader(true);
    this.http
      .post(
        'https://us-central1-jooffers-2a605.cloudfunctions.net/joOffersAdmin/createUser',
        {
          user,
        }
      )
      .subscribe( response => {

        const actionCodeSettings = {
          url: `https://jooffers-2a605.web.app/?email=${user.email}`,
          handleCodeInApp: false
        };

        sendPasswordResetEmail(this.auth, (user.email as string), actionCodeSettings).then((val) => {
          this.loaderService.setLoader(false);
          console.log('email sent to user');
        })
        .catch(err => {
          try {
            console.warn(err)
          } catch (error) {
            console.error(err)
          }
        })
      });
  }

  setBanks() {
    const collectionStore = collection(this.firestore, 'banks');

    (
      collectionData(collectionStore, {idField: 'id'}) as unknown as Observable<IBank[]>
    ).subscribe((banks) => (this.banks = banks));
  }
}
