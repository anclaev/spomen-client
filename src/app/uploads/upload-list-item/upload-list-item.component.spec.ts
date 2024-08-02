import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UploadListItemComponent } from './upload-list-item.component'

describe('UploadListItemComponent', () => {
  let component: UploadListItemComponent
  let fixture: ComponentFixture<UploadListItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadListItemComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(UploadListItemComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
