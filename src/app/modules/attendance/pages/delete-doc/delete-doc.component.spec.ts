import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDocComponent } from './delete-doc.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('DeleteDocComponent', () => {
  let component: DeleteDocComponent;
  let fixture: ComponentFixture<DeleteDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDocComponent ],
      imports: [ ReactiveFormsModule ] // adicione esta linha
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
