import { FormControl } from "@angular/forms";
import { Icategory } from "./category.interface";

export interface IOfferLocation {
    latitude: number;
    longitude: number;
}

export interface IOffer {
    id: string;
    category: Icategory;
    description: string;
    discount: string;
    merchantName: string;
    arMerchantName: string;
    arDescription: string;
    location: IOfferLocation;
    coordinates?: IOfferLocation;
    validUntil: string;
}

export interface IOfferForm {
    category: FormControl<Icategory>;
    description: FormControl<string>;
    discount: FormControl<string>;
    merchantName: FormControl<string>;
    arMerchantName: FormControl<string>;
    arDescription: FormControl<string>;
    latitude: FormControl<number>;
    longitude: FormControl<number>;
    validUntil: FormControl<string>;
    bankName: FormControl<string>
}