import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {

  @Input() public message: string = '';

  constructor(
    public dialogRef: MatDialogRef<AlertsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

}
