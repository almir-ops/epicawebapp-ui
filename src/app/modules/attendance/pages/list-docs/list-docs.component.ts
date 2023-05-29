import { StorageService } from './../../../../shared/services/storage.service';
import { uClient } from './../../../../shared/interfaces/uClient';
import {
  Router
} from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AttendanceService } from '../../attendance.service';
import { catchError, EMPTY, Observable, of, Subscription, tap } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-docs',
  templateUrl: './list-docs.component.html',
})
export class ListDocsComponent implements OnInit, OnDestroy {

  listDocs$!: Observable<uClient[]>;

  currentList: uClient[] = [];

  emptyDoc: boolean = true;

  subscribe!: Subscription;

  formSearch!: FormGroup;

  isLoading: boolean = false;

  alertStyle: string = 'border-gray-500 border-opacity-50';

  selection = new SelectionModel<uClient>(true, []);
  displayedColumns: string[] = [ 'proposta', 'nome', 'quadra', 'setor','lote','acoes'];
  dataSource = new MatTableDataSource<uClient>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private attendanceService: AttendanceService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {

    this.createForm();
    this.getCurrentDocs();

  }

  createForm(){
    this.formSearch = this.formBuilder.group({
      proposta: [''],
      cliente: [
        '',
        Validators.compose([Validators.minLength(3), Validators.required]),
      ],
      quadra: [''],
      lote: [''],
      setor: [''],
      dtFalecimento: [''],
    });
  }

  //salva dados do cliente selecionado e abre componente de details
  showDetails(item: uClient) {
    this.storageService.deleteItem('currentDoc');
    this.storageService.setArray('currentDoc', item);
    this.navegate('atendimento/details');
  }

  //salva dados do cliente selecionado e abre componente de Editar
  showEditDoc(item: uClient) {
    this.storageService.deleteItem('currentDoc');
    this.storageService.setArray('currentDoc', item);
    this.navegate('atendimento/edit');
  }

  //salva dados do cliente selecionado e abre componente de Deletar
  showDeleteDoc(item: uClient) {
    this.storageService.deleteItem('currentDoc');
    this.storageService.setArray('currentDoc', item);
    this.navegate('atendimento/delete');
  }

  //pesquisa clientes com parametros do formSearch
  searchByParams() {

    const { proposta } = this.formSearch.getRawValue();
    const params = this.formSearch.getRawValue();
    console.log(params);

    if (this.formSearch.valid || proposta != '') {
      this.isLoading = true;

      this.subscribe = this.attendanceService.getClientByParams(params).pipe(
        catchError((error) => {
         // se ocorrer erro na busca de registro
         console.error(JSON.parse(error));
         if(JSON.parse(error) === "401"){
           this.isLoading = false;
           this.router.navigate(['login'])
           this.emptyDoc = true;
           this._snackBar.open('Acesso experiado! Faça login novamente.', '', {
             duration: 3000,
             panelClass: ['error-alert'],
           });
         }else{
          this.isLoading = false;
          this._snackBar.open('ERRO: '+ JSON.parse(error), '', {
            duration: 3000,
            panelClass: ['error-alert'],
          });
         }
         return EMPTY;
       })
     ).subscribe({//inscreve observable

      next: (res) =>{

      if (res.length < 1) {
        // se não encontrar registro
        this.emptyDoc = true;
        this.isLoading = false;
        this._snackBar.open('Nenhum registro encontrado', '', {
          duration: 1000,
          panelClass: ['error-alert'],
        });
      } else if (res.length === 1) {
        // se encontrar apenas um registro
        console.log(res);
        console.log('falecimento: '+ res[0].falecimento);

        //this.showDetails(res[0]);
        //this.storageService.deleteItem('currentListDoc');
        this.dataSource.data = res
        this.storageService.setArray('currentListDoc', res);
        this.isLoading = false;
        this.emptyDoc = false;
        let msg = res.length + ' Registros encontrados';
        this._snackBar.open(msg, '', {
          duration: 4000,
          panelClass: ['sucess-alert'],
        });
      } else {
        // se encontra um ou mais registros
        console.log(res);

        this.dataSource.paginator = this.paginator;
        this.dataSource.data = res
        this.storageService.deleteItem('currentListDoc');
        this.storageService.setArray('currentListDoc', res);
        this.isLoading = false;
        this.emptyDoc = false;
        let msg = res.length + ' Registros encontrados';
        this._snackBar.open(msg, '', {
          duration: 4000,
          panelClass: ['sucess-alert'],
        });

      }
    },
    error: (err) => {
      this.router.navigate(['login'])
      this.isLoading = false;
      this._snackBar.open('Acesso experiado! Faça login novamente.', '', {
        duration: 3000,
        panelClass: ['error-alert'],
      });
    }
    });

    } else {
      // se encontra erros no formSearch
      this.alertStyle = 'border-red-600 border-opacity-50';
      this._snackBar.open('Digite um nome ou proposta para pesquisar', '', {
        duration: 3000,
        panelClass: ['error-alert'],
      });
    }
  }

  //pega registros da ultima pesquisa
  getCurrentDocs() {
    this.currentList = JSON.parse(
      this.storageService.getItem('currentListDoc')!
    );
    if (this.currentList != null) {
      this.listDocs$ = of(this.currentList);
      this.listDocs$.subscribe((res:uClient[]) =>
        {
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.dataSource.data = res;
        }
      )
      this.emptyDoc = false;
    }
  }

  upperTextQuadra(){
    const quadraUpper = this.formSearch.controls['quadra'].value.toUpperCase();
    this.formSearch.get('quadra')?.setValue(quadraUpper);
  }

  styleInput() {
    this.alertStyle = 'border-gray-500 border-opacity-50';
  }

  navegate(rota: string) {
    this.router.navigate([rota]);
  }

  navegateById(rota: string, id: string) {
    this.router.navigate([rota, id]);
  }

  copyText(val: string){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
  }


  clearList(){
    this.storageService.deleteItem('currentListDoc')
    this.dataSource.data = [];
  }

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
}
