import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule, } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DialogComponent } from './components/dialog/dialog.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaginatorIntl } from './services/paginator.service';


const matModules = [
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatIconModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatStepperModule,
  MatDialogModule,
  MatPaginatorModule
];

const angulatModules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule,
  GoogleMapsModule,
  NgxFileDropModule
]
@NgModule({
  declarations: [
    DialogComponent,
    SpinnerComponent
  ],
  imports: [
   ...angulatModules,
   ...matModules
  ],
  exports: [
    ...matModules,
    ...angulatModules,
    DialogComponent,
    SpinnerComponent
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorIntl
    }
  ]
})
export class SharedModule { }
