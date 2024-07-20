import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UploadInfoComponent } from './upload-info.component'

describe('UploadInfoComponent', () => {
  let component: UploadInfoComponent
  let fixture: ComponentFixture<UploadInfoComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadInfoComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(UploadInfoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
