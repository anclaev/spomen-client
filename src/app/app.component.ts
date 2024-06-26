import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TuiAlertService,
  TuiLoaderModule,
} from '@taiga-ui/core'

import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { Subscription, filter, map } from 'rxjs'
import * as VKID from '@vkid/sdk'

import { env } from '@env'

import { inOutAnimation } from '@animations'
import { AuthService } from '@services'
import { getCurrentPath } from '@utils'

import { HeaderComponent } from '@components/header'
import { OopsComponent } from '@components/oops'
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
  ],
  animations: [inOutAnimation],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private alerts = inject(TuiAlertService)
  private router = inject(Router)
  auth = inject(AuthService)

  isRefused: boolean = false
  isNotFound: boolean = false

  navIsFull: boolean =
    (localStorage.getItem('nav') as unknown as boolean) || true

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
    this.auth.$loading.next(true)

    this.subs.push(
      this.router.events
        .pipe(
          filter((val) => val instanceof NavigationEnd),
          map((a: any) => {
            if (a.url && a.urlAfterRedirects) {
              this.isNotFound =
                a.url.includes('/404') || a.urlAfterRedirects.includes('/404')
            }
          })
        )
        .subscribe()
    )

    this.subs.push(
      this.auth.init().subscribe({
        next: (user) => {
          this.auth.set(user)
          this.auth.$loading.next(false)
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 0) {
            this.isRefused = true
            this.auth.$loading.next(false)
            return
          }

          this.auth.$loading.next(false)

          this.router.navigateByUrl(getCurrentPath(this.router))
        },
      })
    )
  }

  toggleNav() {
    this.navIsFull = !this.navIsFull
    localStorage.setItem('nav', String(this.navIsFull))
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe())
  }
}
