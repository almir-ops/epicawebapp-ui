import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableFormComponent } from './dynamic-table-form.component';

describe('DynamicTableFormComponent', () => {
  let component: DynamicTableFormComponent;
  let fixture: ComponentFixture<DynamicTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTableFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
