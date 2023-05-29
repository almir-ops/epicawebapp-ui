import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDocsComponent } from './edit-docs.component';

describe('EditDocsComponent', () => {
  let component: EditDocsComponent;
  let fixture: ComponentFixture<EditDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
