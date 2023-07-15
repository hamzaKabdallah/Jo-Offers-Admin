import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';
import { IAuthUser } from 'src/app/shared/interfaces/auth-user.interface';
import { IOffer } from 'src/app/shared/interfaces/offer.interface';
import { OffersService } from 'src/app/shared/services/offers.service';
import { UserStoreService } from 'src/app/shared/services/user-store.service';
import {
  Firestore,
  collectionData,
  collection,
  where,
  query,
  orderBy,
  DocumentReference,
  doc,
} from '@angular/fire/firestore';
import { limit, startAfter } from 'firebase/firestore';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  user!: IAuthUser | null;
  offers!: Observable<IOffer[]>;
  protected currentPage = 1;
  protected pageSize = 10;
  protected length = 0;
  lastItem:any;
  /**
   *
   */
  constructor(
    private router: Router,
    private userStoreService: UserStoreService,
    private offersService: OffersService,
    private firestore: Firestore,
  ) {
    
  }

  goToAddPage(path: string): void {
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    this.userStoreService.getUser().subscribe((user) => {
      if (!user) {
        return;
      }
      this.user = user;
      this.loadItems();
    });
  }

  loadItems() {
    this.offers = this.offersService.getOffers(this.user!.bank)
      .pipe(
        tap(items => this.length = items.length),
        map(items => {
          const startIndex = (this.currentPage - 1) * this.pageSize;
          return items.slice(startIndex, startIndex + this.pageSize);
        })
      );
  }

  handlePageEvent(page:number) {

    this.currentPage = page;
    this.loadItems();
  }
}
