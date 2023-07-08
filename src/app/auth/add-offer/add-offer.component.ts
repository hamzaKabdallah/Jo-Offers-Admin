import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOffer, IOfferForm } from 'src/app/shared/interfaces/offer.interface';
import { UserStoreService } from 'src/app/shared/services/user-store.service';
import { IAuthUser } from 'src/app/shared/interfaces/auth-user.interface';
import { HttpClient } from '@angular/common/http';
import {
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { IBank } from 'src/app/shared/interfaces/banks.interface';
import { Observable } from 'rxjs';
import { GoogleMap } from '@angular/google-maps';
import { environment } from 'src/environments/environment.development';
import { AbstractControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { base64 } from '@firebase/util';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { OffersService } from 'src/app/shared/services/offers.service';
import { Icategory } from 'src/app/shared/interfaces/category.interface';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit, AfterViewInit {
  @ViewChild('mapSearchField') serchField!: ElementRef;
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild('stepper') stepper!: MatStepper;

  protected form!: FormGroup<IOfferForm>;
  protected user!: IAuthUser | null;
  startDate = new Date();
  protected categories: Icategory[] = [];
  banks!: Observable<IBank[]>;

  // update
  private offerDetail!: IOffer | null;

  // Google Map Dependinces
  protected initialCoordinates = {
    lat: 31.973563151821196,
    lng: 35.879144795504025,
  };

  circle!: google.maps.Circle;

  mapConfigurations = {
    disableDefaultUI: false,
    fullscreenControl: true,
    zoomControl: true,
  };

  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  isupdateMode: boolean = false;

  /**
   *
   */
  constructor(
    private formBuilder: FormBuilder,
    private userStoerService: UserStoreService,
    private http: HttpClient,
    private firestore: Firestore,
    private storage: Storage,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private offersSerivce: OffersService
  ) {}

  ngOnInit(): void {
    this.setCategories();
    this.setUpdateOfferDetails();
    this.newForm();
    this.setUser();
    this.setBanks();
    this.changesListeners();
  }

  setCategories(): void {
    this.http.get<Icategory[]>('assets/categories.json')
    .subscribe((categories) => this.categories = categories);
  }

  setBanks() {
    const banksRef = collection(this.firestore, 'banks');
    this.banks = collectionData(query(banksRef, orderBy('shortName')), {
      idField: 'id',
    }) as Observable<IBank[]>;
  }

  changesListeners() {}

  setUser() {
    this.userStoerService
      .getUser()
      // .pipe(take(1))
      .subscribe((user) => {
        this.user = user;
        this.form.controls.bankName.setValue(user?.bankName || '');
      });
  }

  newForm() {
    let initialValues;

    if (this.isupdateMode) {
      const {
        category,
        id,
        coordinates,
        validUntil,
        discount,
        description,
        merchantName,
        arMerchantName,
      } = this.offerDetail as IOffer;

      initialValues = {
        category,
        description,
        discount,
        merchantName,
        arMerchantName,
        latitude: coordinates?.latitude || this.initialCoordinates.lat,
        longitude: coordinates?.longitude || this.initialCoordinates.lng,
        validUntil,
      };
    } else {
      initialValues = {
        category: this.categories[1],
        description: '',
        discount: '',
        merchantName: '',
        arMerchantName: '',
        latitude: this.initialCoordinates.lat,
        longitude: this.initialCoordinates.lng,
        validUntil: '',
      };
    }

    this.form = this.formBuilder.nonNullable.group({
      category: this.formBuilder.nonNullable.control(initialValues.category, [
        Validators.required,
      ]),
      description: this.formBuilder.nonNullable.control(
        initialValues.description,
        [Validators.required]
      ),
      arDescription: this.formBuilder.nonNullable.control(
        initialValues.description,
      ),
      discount: this.formBuilder.nonNullable.control(initialValues.discount, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      merchantName: this.formBuilder.nonNullable.control(
        initialValues.merchantName,
        [Validators.required]
      ),
      arMerchantName: this.formBuilder.nonNullable.control(
        initialValues.merchantName,
      ),
      latitude: this.formBuilder.nonNullable.control(initialValues.latitude, [
        Validators.required,
      ]),
      longitude: this.formBuilder.nonNullable.control(initialValues.longitude, [
        Validators.required,
      ]),
      validUntil: this.formBuilder.nonNullable.control(
        initialValues.validUntil,
        [Validators.required, CustomDateValidator]
      ),
      bankName: this.formBuilder.nonNullable.control(this.user?.bankName || ''),
    });
  }

  submit(stepper: MatStepper) {
    console.log(this.form.value);

    // this check for detect if the user selected place or not
    if (!this.markerPositions.length) {
      this.setSelectPlaceValidity(true);
      return;
    }

    this.loaderService.setLoader(true);
    if (this.isupdateMode) {
      const docRef = this.offersSerivce.getOfferDoc(
        this.user?.bank as string,
        this.offerDetail?.id as string
      );
      updateDoc(docRef, this.getParams())
        .then((v) => {
          this.loaderService.setLoader(false);
          this.stepper.next();
          console.log({ v });
        })
        .catch((error) => {
          this.loaderService.setLoader(false);
          console.error(error);
        });
    } else {
      this.http
        .post(`${environment.baseFireBaseUrl}/addOffers`, this.getParams())
        .subscribe(
          (response) => {
            this.loaderService.setLoader(false);
            this.stepper.next();
            console.log({ response });
          },
          (error) => {
            this.loaderService.setLoader(false);
            console.error(error);
          }
        );
    }
  }

  ngAfterViewInit(): void {
    const searchBox = new google.maps.places.SearchBox(
      this.serchField.nativeElement
    );

    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.serchField.nativeElement
    );

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places?.length === 0) {
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      places?.forEach((place) => {
        if (!place.geometry?.location) {
          return;
        }

        if (place.geometry.viewport) {
          // only geocodes have viewport
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
  }

  getParams() {
    const { latitude, longitude, merchantName, discount, arMerchantName, description, arDescription } = this.form.value;
    const params = {
      ...this.form.value,
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      merchantName: merchantName?.toLowerCase(),
      arMerchantName: arMerchantName ? arMerchantName : merchantName,
      displayName: merchantName,
      discount: discount + '%',
      bankId: this.user?.bank,
      description: description,
      arDescription

    };
    delete params.longitude;
    delete params.latitude;

    return { offer: { bankID: this.user?.bank, offers: [params] } };
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) {
      return;
    }

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    this.initialCoordinates = { lat, lng };

    // delete the current one until build feature for the multi places
    this.markerPositions.pop();

    // Add mark ot the map view
    this.markerPositions.push(event.latLng.toJSON());

    this.form.controls.latitude.setValue(lat);
    this.form.controls.latitude.setValue(lng);
    this.setSelectPlaceValidity(false);
  }

  setSelectPlaceValidity(value: boolean) {
    this.form.setErrors({ isSelectPlace: value });
  }

  onLogochanged(formData: File) {
    const filePath = `logos/${formData.name}`;
    const storageRef = ref(this.storage, filePath);

    uploadBytesResumable(storageRef, formData);
  }

  setUpdateOfferDetails(): void {
    this.isupdateMode = this.activatedRoute.snapshot.queryParams['offer'];
    if (this.isupdateMode) {
      this.offerDetail = JSON.parse(
        this.activatedRoute.snapshot.queryParamMap.get('offer') as string
      ) as IOffer;
      return;
    }

    this.offerDetail = null;
  }
}

function CustomDateValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const selectedDate = control.value;
  const currentDate = new Date();

  if (selectedDate < currentDate) {
    return { pastDate: true };
  }
  return null;
}
