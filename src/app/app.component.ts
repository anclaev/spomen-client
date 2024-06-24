import {
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core'

import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TuiAlertService,
  TuiLoaderModule,
} from '@taiga-ui/core'

import { HttpErrorResponse } from '@angular/common/http'
import { Router, RouterOutlet } from '@angular/router'
import { Subscription } from 'rxjs'
import * as VKID from '@vkid/sdk'

import { env } from '@env'

import { HeaderComponent } from '@components/header/header.component'
import { inOut } from '@animations/in-out'

import { getCurrentPath } from '@utils/getCurrentPath'
import { AuthService } from '@services/auth.service'

@Component({
  selector: 'spomen-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiLoaderModule,
    HeaderComponent,
  ],
  animations: [inOut],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private alerts = inject(TuiAlertService)
  private router = inject(Router)
  auth = inject(AuthService)

  private subs: Subscription[] = []

  constructor() {
    VKID.Config.set({
      app: env.appId,
      redirectUrl: env.redirectUrl,
      state: 'dj29fnsadjsd82f249k293c139j1kd3',
    })

    effect(() => {
      if (this.auth.$isAuth()) {
        const { first_name, username } = this.auth.$user()

        this.subs.push(
          this.alerts.open(`Привет, ${first_name || username}!`).subscribe()
        )

        if (getCurrentPath(this.router).includes('/auth')) {
          this.router.navigate(['/'])
        }
      }
    })
  }

  ngOnInit(): void {
    this.auth.$loading.set(true)

    this.subs.push(
      this.auth.init().subscribe({
        next: (user) => {
          this.auth.set(user)
          this.auth.$loading.set(false)
        },
        error: (err: HttpErrorResponse) => {
          if (err.status !== 401) {
            this.subs.push(this.alerts.open(err.message).subscribe())
            return
          }
          this.auth.$loading.set(false)
        },
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe())
  }
}
