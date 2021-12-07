import { TestBed } from '@angular/core/testing';

import { AuthIngGuard } from './auth-ing.guard';

describe('AuthingGuard', () => {
  let guard: AuthIngGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthIngGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
