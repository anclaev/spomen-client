import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TuiAlertService,
  TuiLoaderModule,
} from '@taiga-ui/core'

import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { Router, RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Subscription } from 'rxjs'
import * as VKID from '@vkid/sdk'

import { env } from '@env'

import { inOutAnimation200, inOutAnimation500 } from '@animations'
import { AuthService, ConfigService } from '@services'
import { getCurrentPath } from '@utils'

import { HeaderComponent } from '@components/header'
import { OopsComponent } from '@components/oops'
import { MenuComponent } from '@components/menu'
import { NavComponent } from '@components/nav'

@Component({
  selector: 'spomen-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiLoaderModule,
    HeaderComponent,
    NavComponent,
    OopsComponent,
    MenuComponent,
  ],
  animations: [inOutAnimation200, inOutAnimation500],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private alerts = inject(TuiAlertService)
  private router = inject(Router)
  config = inject(ConfigService)
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
    this.auth.$isLoading.next(true)

    this.subs.push(
      this.auth.init().subscribe({
        next: (user) => {
          this.auth.set(user)
          this.auth.$isLoading.next(false)
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 0) {
            this.config.$isRefusedPage.set(true)
            this.auth.$isLoading.next(false)
            return
          }

          this.auth.$isLoading.next(false)

          this.router.navigateByUrl(getCurrentPath(this.router))
        },
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe())
  }
}
