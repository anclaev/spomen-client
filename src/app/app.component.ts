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
import { RouterOutlet } from '@angular/router'
import { Subscription } from 'rxjs'
import * as VKID from '@vkid/sdk'

import { env } from '@env'

import { HeaderComponent } from '@components/header/header.component'
import { inOut } from '@animations/in-out'

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
  private auth = inject(AuthService)

  private subs: Subscription[] = []

  $loading: WritableSignal<boolean> = signal(false)

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
      }
    })
  }

  ngOnInit(): void {
    this.$loading.set(true)
    this.subs.push(
      this.auth.init().subscribe({
        next: () => {
          this.$loading.set(false)
        },
        error: (err: HttpErrorResponse) => {
          if (err.status !== 401) {
            this.subs.push(this.alerts.open(err.message).subscribe())
            return
          }
          this.$loading.set(false)
        },
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe())
  }
}
