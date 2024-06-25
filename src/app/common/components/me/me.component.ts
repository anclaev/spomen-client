import {
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  inject,
} from '@angular/core'

import { TuiDialogService, TuiSvgModule } from '@taiga-ui/core'
import { Router } from '@angular/router'

import { AuthService } from '@services'

@Component({
  selector: 'spomen-me',
  standalone: true,
  imports: [TuiSvgModule],
  templateUrl: './me.component.html',
  styleUrl: './me.component.scss',
})
export class MeComponent {
  dialogs = inject(TuiDialogService)
  destroyRef = inject(DestroyRef)
  auth = inject(AuthService)
  router = inject(Router)

  @Output() close = new EventEmitter()

  handleMe() {
    this.router.navigate([`/${this.auth.$user().username}`])
    this.close.emit()
  }

  handleSignOut() {
    this.dialogs
      .open('Выйти из воспоминаний?', {
        size: 's',
        required: true,
      })
      .subscribe({
        error: () => {},
        complete: () =>
          this.auth.signOut().subscribe({
            next: () => {
              this.auth.clear()
              this.router.navigate(['/auth'])
              this.close.emit()
            },
            error: () => {
              this.auth.clear()
              this.router.navigate(['/auth'])
              this.close.emit()
              window.location.reload()
            },
          }),
      })
  }
}
