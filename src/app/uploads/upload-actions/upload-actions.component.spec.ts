import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UploadActionsComponent } from './upload-actions.component'

describe('UploadActionsComponent', () => {
  let component: UploadActionsComponent
  let fixture: ComponentFixture<UploadActionsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadActionsComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(UploadActionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
