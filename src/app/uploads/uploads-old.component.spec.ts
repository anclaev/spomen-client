import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UploadsOldComponent } from './uploads-old.component'

describe('UploadsComponent', () => {
  let component: UploadsOldComponent
  let fixture: ComponentFixture<UploadsOldComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadsOldComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(UploadsOldComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
