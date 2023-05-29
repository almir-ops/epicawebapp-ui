import { TestBed } from '@angular/core/testing';

import { AccessService } from './access.service';
import { HttpClientModule } from '@angular/common/http';

describe('AccessService', () => {
  let service: AccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(AccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
