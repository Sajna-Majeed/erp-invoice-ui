import { TestBed } from '@angular/core/testing';

import { UserInfo } from './user';

describe('User', () => {
  let service: UserInfo;

  beforeEach(() => {
    // Provide a mock object for User since it's a type/interface
    service = {} as UserInfo;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
