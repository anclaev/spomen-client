import { Component, effect, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { getState } from '@ngrx/signals'
import * as VKID from '@vkid/sdk'

import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TuiAlertService,
} from '@taiga-ui/core'

import { AuthStore } from '@store/auth'
import { env } from '@env'

import { HeaderComponent } from '@common/components/header/header.component'

@Component({
  selector: 'spomen-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    HeaderComponent,
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private store = inject(AuthStore)
  private alerts = inject(TuiAlertService)

  constructor() {
    VKID.Config.set({
      app: env.appId,
      redirectUrl: env.redirectUrl,
      state: 'dj29fnsadjsd82f249k293c139j1kd3',
    })

    this.store.initAuth('')

    effect(() => {
      const auth = getState(this.store)

      if (auth.id) {
        this.alerts
          .open(`Привет, ${auth.first_name || auth.login}!`)
          .subscribe()
      }
    })
  }
}
