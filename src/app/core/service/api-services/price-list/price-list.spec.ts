import { TestBed } from '@angular/core/testing';

import { PriceListApiService } from './price-list';

describe('PriceListApiService', () => {
  let service: PriceListApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceListApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
