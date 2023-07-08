import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, take } from 'rxjs';
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
  offers!: IOffer[];

  protected currentPage = 0;

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
        this.offers = offers;
      })
    });
  }

  goToAddPage(path: string): void {
    this.router.navigate([path]);
  }

  handlePageEvent(pageEvent: PageEvent) {
    console.log(pageEvent);
    
  }
}
