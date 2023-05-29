import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDocsComponent } from './list-docs.component';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ListDocsComponent', () => {
  let component: ListDocsComponent;
  let fixture: ComponentFixture<ListDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDocsComponent ],
      imports: [HttpClientModule,MatSnackBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
