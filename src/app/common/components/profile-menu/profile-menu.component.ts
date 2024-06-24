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
  selector: 'spomen-profile-menu',
  standalone: true,
  imports: [TuiSvgModule],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss',
})
export class ProfileMenuComponent {
  dialogs = inject(TuiDialogService)
  destroyRef = inject(DestroyRef)
  auth = inject(AuthService)
  router = inject(Router)

  @Output() close = new EventEmitter()

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
