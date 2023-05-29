import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmations',
  templateUrl: './confirmations.component.html',
  styleUrls: ['./confirmations.component.scss']
})
export class ConfirmationsComponent implements OnInit {

  @Input() public message: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

}
