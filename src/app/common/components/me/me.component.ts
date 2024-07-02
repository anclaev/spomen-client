import {
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  inject,
} from '@angular/core'

import { TuiDialogService, TuiSvgModule } from '@taiga-ui/core'
import { AuthService, ConfigService } from '@services'
import * as Sentry from '@sentry/angular'
import { Router } from '@angular/router'

@Component({
  selector: 'spomen-me',
  standalone: true,
  imports: [TuiSvgModule],
  templateUrl: './me.component.html',
  styleUrl: './me.component.scss',
})
@Sentry.TraceClass({ name: 'Me' })
export class MeComponent {
  dialogs = inject(TuiDialogService)
  destroyRef = inject(DestroyRef)
  config = inject(ConfigService)
  auth = inject(AuthService)
  router = inject(Router)

  @Output() close = new EventEmitter()

  handleMe() {
    this.router.navigate([`/${this.auth.$user().username}`])
    this.config.closeMenu()
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
