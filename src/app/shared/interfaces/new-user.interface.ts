import { FormControl } from "@angular/forms";
import { IBank } from "./banks.interface";

export interface INewUser {
    role: FormControl<number>;
    name: FormControl<string>;
    bank: FormControl<string>;
    email: FormControl<string>;
    bankName: FormControl<string>;
}