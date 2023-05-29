import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifcaArquivosComponent } from './verifca-arquivos.component';

describe('VerifcaArquivosComponent', () => {
  let component: VerifcaArquivosComponent;
  let fixture: ComponentFixture<VerifcaArquivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifcaArquivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifcaArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
