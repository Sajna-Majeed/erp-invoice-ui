import { TestBed } from '@angular/core/testing';

import { LicenseModeService } from './license-mode';

describe('LicenseModeService', () => {
  let service: LicenseModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
