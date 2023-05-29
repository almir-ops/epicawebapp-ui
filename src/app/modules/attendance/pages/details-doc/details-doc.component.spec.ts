import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDocComponent } from './details-doc.component';

describe('DetailsDocComponent', () => {
  let component: DetailsDocComponent;
  let fixture: ComponentFixture<DetailsDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
