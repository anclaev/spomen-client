import {
  TuiFileLike,
  TuiInputFilesModule,
  TuiInputInlineModule,
  TuiStepperModule,
  TuiToggleModule,
} from '@taiga-ui/kit'

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Component, OnInit, signal, WritableSignal } from '@angular/core'
import { TuiChipModule } from '@taiga-ui/experimental'
import { TuiLoaderModule } from '@taiga-ui/core'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'

import { enterLeaveAnimation } from '@animations'

@Component({
  selector: 'spomen-upload-file',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputFilesModule,
    TuiLoaderModule,
    TuiStepperModule,
    TuiInputInlineModule,
    TuiToggleModule,
    TuiChipModule
  ],
  animations: [enterLeaveAnimation],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
})
@Sentry.TraceClass({ name: 'UploadFile' })
export class UploadFileComponent implements OnInit {
  isLoading: WritableSignal<boolean> = signal(false)

  readonly control = new FormControl<TuiFileLike | null>(null)

  readonly fileForm = new FormGroup({
    name: new FormControl('avatar'),
    ext: new FormControl('.png'),
    compress: new FormControl(true),
    private: new FormControl(false),
  })

  currentStep: number = 1

  ngOnInit() {
    this.fileForm.controls['ext'].disable()
  }

  removeFile(): void {
    this.control.setValue(null)
  }

  nextStep() {
    if (this.control.value) {
      this.currentStep++
    }
  }

  uploadFile() {
    this.isLoading.set(true)
  }
}


















