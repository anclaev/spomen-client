import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PermissionInputComponent } from './permission-input.component'

describe('PermissionInputComponent', () => {
  let component: PermissionInputComponent
  let fixture: ComponentFixture<PermissionInputComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionInputComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PermissionInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
