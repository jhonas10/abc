import { TestBed } from '@angular/core/testing';

import { AuthGuardAdmin } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuardAdmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuardAdmin);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
