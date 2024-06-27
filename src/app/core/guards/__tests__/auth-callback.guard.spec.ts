import { TestBed } from '@angular/core/testing'
import { CanActivateFn } from '@angular/router'

import { authCallbackGuard } from '../auth-callback.guard'

describe('authCallbackGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authCallbackGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })
})
