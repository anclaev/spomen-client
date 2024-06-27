import { TestBed } from '@angular/core/testing'
import { CanActivateFn } from '@angular/router'

import { refusedGuard } from '../refused.guard'

describe('refusedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => refusedGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })
})
