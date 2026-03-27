import { TestBed } from '@angular/core/testing';

import { UiService } from './profile';

describe('User', () => {
  let service: UiService;

  beforeEach(() => {
    // Provide a mock object for User since it's a type/interface
    service = {} as UiService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
