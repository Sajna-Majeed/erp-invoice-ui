import { TestBed } from '@angular/core/testing';

import { CustomerTypeApiService } from './customer-type';

describe('CustomerTypeApiService', () => {
  let service: CustomerTypeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerTypeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
