import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mat-table-checkbox',
  templateUrl: './mat-table-checkbox.component.html',
  styleUrls: ['./mat-table-checkbox.component.scss']
})
export class MatTableCheckboxComponent implements OnInit {
  @Input() selection = new SelectionModel<any>(true, []);
  @Input() displayedColumns: string[] = [
    'select',
    'proposta',
    'cliente',
    'valor',
    'vencimento',
    'email',
    'status',
  ];
  @Input() dataSource = new MatTableDataSource<any>();
  @Input() paginator!: MatPaginator;
  @Input() listRemaining: any[] = [];
  @Output() selectedContracts = new EventEmitter<string[]>();
  @Output() disabledBtn = new EventEmitter<boolean>();;
  @Output() styleSendBtn = new EventEmitter<string>();
  @Input() tablePaginator!: TemplateRef<any>;

  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  selections: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.styleSendBtn.emit('bg-gray-300');
    this.dataSource.connect();

  }

  isAllSelected() {
    //console.log('isAllSelected');

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    const leftoverRows = this.listRemaining.length;
    if(this.listRemaining.length >= 1){
      return leftoverRows === numSelected;
    }else{
      return numSelected === numRows;
    }
  }
  toggleAllRows() {
    //console.log('toggleAllRows');

    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    if(this.listRemaining.length >= 1){
      this.selection.clear();
      console.log(this.selection.selected);
      //this.selection.select(...this.listRemaining);
    }else{
      console.log(this.dataSource.data);
      this.selection.select(...this.dataSource.data);
    }
  }
  checkboxLabel(row?: any): string {
    //console.log('checkboxLabel');

    this.selections = this.selection.selected;
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  emitValue(){
    setTimeout(() => {
      this.selectedContracts.emit(this.selections);
    }, 100);
  }
}
