import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarProdutosComponent } from './buscar-produtos.component';

describe('BuscarProdutosComponent', () => {
  let component: BuscarProdutosComponent;
  let fixture: ComponentFixture<BuscarProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarProdutosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
