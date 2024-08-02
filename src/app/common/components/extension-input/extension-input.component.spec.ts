import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ExtensionInputComponent } from './extension-input.component'

describe('ExtensionFilterInputComponent', () => {
  let component: ExtensionInputComponent
  let fixture: ComponentFixture<ExtensionInputComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtensionInputComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ExtensionInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
