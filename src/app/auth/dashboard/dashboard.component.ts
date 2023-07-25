import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IOffer } from 'src/app/shared/interfaces/offer.interface';
import { UserStoreService } from 'src/app/shared/services/user-store.service';
import { IAuthUser } from 'src/app/shared/interfaces/auth-user.interface';
import { OffersService } from 'src/app/shared/services/offers.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  protected offersList!: Observable<IOffer>;
  user!: IAuthUser | null;
  offers!: Observable<IOffer[]>;
  protected currentPage = 1;
  protected pageSize = 10;
  protected pageLength = 0;
  lastItem:any;


  constructor(
    private router: Router,
    private userStoreService: UserStoreService,
    private offersService: OffersService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoader(true);
    this.userStoreService.getUser().subscribe((user) => {
      if (!user) {
        return;
      }

      this.user = user;

      this.offersService.getOffers(this.user.bank)
      .subscribe(offers => {
        this.loaderService.setLoader(false);
        this.loadItems();
      })
    });
  }

  goToAddPage(path: string): void {
    this.router.navigate([path]);
  }

  loadItems() {
    this.offers = this.offersService.getOffers(this.user!.bank)
      .pipe(
        tap(items => this.pageLength = items.length),
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
