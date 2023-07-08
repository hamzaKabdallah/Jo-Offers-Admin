import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from '@firebase/util';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { IOffer } from 'src/app/shared/interfaces/offer.interface';
import { Firestore, collection, addDoc, deleteDoc, doc, DocumentReference, } from '@angular/fire/firestore';
import { IAuthUser } from 'src/app/shared/interfaces/auth-user.interface';
import { OffersService } from 'src/app/shared/services/offers.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})
export class OfferComponent {
  @Input() offer!: IOffer;
  @Input() user!: IAuthUser | null;

  /**
   *
   */
  constructor(
    private rout: Router,
    private dialog: MatDialog,
    private fs: Firestore,
    private offersService: OffersService
  ) {}

  onDelete(): void {
    const archiveCollectionInistance = collection(this.fs, 'archive');

    const dialog = this.dialog.open(DialogComponent, {
      data: {
        title: 'Be Carefull',
        description: 'are you sure that you want to delete the offer ?',
      },
    });

    dialog.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'delete') {
        const path = `offers/${this.user?.bank}/offers/${this.offer.id}`;
        const delRef = deleteDoc(doc(this.fs, path));

        // add to the archive collection
        // addDoc(archiveCollectionInistance, this.offer).then(() => console.log('added to archive'));

        Promise.all([delRef]).then(console.log);
      }
    });
  }

  onUpdate(): void {
    const docRef = this.offersService.getOfferDoc((this.user?.bank as string), this.offer.id);

    console.log({docRef});
    
    this.rout.navigate(['auth/add-offer'], {
      queryParams: { offer: JSON.stringify(this.offer) },
    });
  }
}
