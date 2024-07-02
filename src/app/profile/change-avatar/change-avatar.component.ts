import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Component, WritableSignal, signal } from '@angular/core'
import { TuiInputFilesModule } from '@taiga-ui/kit'
import { TuiLoaderModule } from '@taiga-ui/core'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'
@Component({
  selector: 'spomen-change-avatar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputFilesModule,
    TuiLoaderModule,
  ],
  templateUrl: './change-avatar.component.html',
  styleUrl: './change-avatar.component.scss',
})
@Sentry.TraceClass({ name: 'ChangeAvatar' })
export class ChangeAvatarComponent {
  readonly control = new FormControl()

  isLoading: WritableSignal<boolean> = signal(false)

  removeFile(): void {
    this.control.setValue(null)
  }

  changeAvatar() {
    this.isLoading.set(true)
  }
}
