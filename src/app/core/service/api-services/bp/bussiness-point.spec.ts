import { TestBed } from '@angular/core/testing';

import { BussinessPoint } from './bussiness-point';

describe('BussinessPoint', () => {
  let service: BussinessPoint;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BussinessPoint);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
