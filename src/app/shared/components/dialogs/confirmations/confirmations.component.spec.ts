import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationsComponent } from './confirmations.component';

describe('ConfirmationsComponent', () => {
  let component: ConfirmationsComponent;
  let fixture: ComponentFixture<ConfirmationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
