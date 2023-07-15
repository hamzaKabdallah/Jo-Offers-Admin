import { Injectable } from '@angular/core';
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
import { CollectionReference, DocumentData, limit, startAfter, getCountFromServer } from 'firebase/firestore';
import { Observable, last, take } from 'rxjs';
import { IOffer } from '../interfaces/offer.interface';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  first!: Observable<DocumentData[]>;


  

  constructor(
    private firestore: Firestore,
  ) { 
    
  }

  getOffersCount(bank: string){
    const ref = collection(this.firestore, `offers/${bank}/offers`);
    return getCountFromServer(ref);
  }
  
  getOffers(bank: string) {
    const collectionStore = collection(
      this.firestore,
      `offers/${bank}/offers`
    );

    return (collectionData(
      query(
        collectionStore,
        where('validUntil', '>=', new Date()),
        orderBy('validUntil'),
        //limit(5),
      ),
      { idField: 'id' }
    ) as Observable<IOffer[]>);
  }

  getOfferDoc(bank: string, id: string): DocumentReference {
    const path = `offers/${bank}/offers/${id}`;
    return doc(this.firestore, path);
  }
}
