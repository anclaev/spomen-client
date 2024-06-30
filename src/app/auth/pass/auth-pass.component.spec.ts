import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AuthPassComponent } from './auth-pass.component'

describe('AuthPassComponent', () => {
  let component: AuthPassComponent
  let fixture: ComponentFixture<AuthPassComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPassComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AuthPassComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
