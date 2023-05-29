import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TiService } from '../../ti.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {
  formGroup!: FormGroup;

  listGrupos: any[] = [];
  constructor(
    private formBuilder : FormBuilder,
    private tiService: TiService
  ) { }

  ngOnInit(): void {
    this.tiService.getFuncionalidades().subscribe((res:any) => {
      console.log(res);
      this.listGrupos = res;
    });

    this.createForm();
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],

    })
  }

  save(){}

  navegate(rota:any){}

}
