import { TestBed } from '@angular/core/testing';

import { CustomPriceApiService } from './customPrice';

describe('CustomPriceApiService', () => {
  let service: CustomPriceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomPriceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
