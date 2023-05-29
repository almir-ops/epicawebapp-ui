import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss']
})
export class MatTableComponent implements OnInit {

  @Input() dataSource = new MatTableDataSource<any>();
  @Input() displayedColumns: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
