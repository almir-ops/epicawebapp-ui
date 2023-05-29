import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-table-form',
  templateUrl: './dynamic-table-form.component.html',
  styleUrls: ['./dynamic-table-form.component.scss']
})
export class DynamicTableFormComponent implements OnInit {

  @Input() listPermissions!: any;
  @Input() form!: FormGroup;

  @Input() permissions1:any;

  @Input() actions: string[] = ['visualizar', 'incluir', 'editar', 'excluir'];

  subscription!: Subscription;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    console.log(this.listPermissions);
    console.log(this.permissions1);

    const checkboxControl = (this.form.controls['actions'] as FormArray);
    /* this.subscription = checkboxControl.valueChanges.subscribe(checkbox => {
      checkboxControl.setValue(
        checkboxControl.value.map((value: any, i: any) => value ? this.actions[i] : false),
        { emitEvent: false }
      );
    })
 */
  }

}
