import { TestBed } from '@angular/core/testing';

import { AuthSecreGuard } from './auth-secre.guard';

describe('AuthSecreGuard', () => {
  let guard: AuthSecreGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthSecreGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
