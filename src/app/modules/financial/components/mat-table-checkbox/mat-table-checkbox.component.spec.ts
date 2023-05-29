import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableCheckboxComponent } from './mat-table-checkbox.component';

describe('MatTableCheckboxComponent', () => {
  let component: MatTableCheckboxComponent;
  let fixture: ComponentFixture<MatTableCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTableCheckboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatTableCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
