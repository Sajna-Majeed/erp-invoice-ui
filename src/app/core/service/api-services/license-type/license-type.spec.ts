import { TestBed } from '@angular/core/testing';

import { LicenseTypeService } from './license-type';

describe('LicenseTypeService', () => {
  let service: LicenseTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
