import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogData } from '../../interfaces/dialog-data.interface';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @Input() description!: string;

  /**
   *
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    dialogRef: MatDialogRef<DialogComponent>
  ) {}

  
}
