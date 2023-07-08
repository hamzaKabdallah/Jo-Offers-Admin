import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { OfferComponent } from './offer/offer.component';
import { FileUploaderComponent } from './add-offer/file-uploader/file-uploader.component';



@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    AdminDashboardComponent,
    AddUserComponent,
    AddOfferComponent,
    OfferComponent,
    FileUploaderComponent
  ],
  imports: [
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
