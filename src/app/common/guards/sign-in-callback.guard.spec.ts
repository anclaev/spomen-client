import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { signInCallbackGuard } from './sign-in-callback.guard';

describe('signInCallbackGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => signInCallbackGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
