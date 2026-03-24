import { TestBed } from '@angular/core/testing';

import { CustomerApiService } from './role';

describe('CustomerApiService', () => {
  let service: CustomerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
