import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TuiAlertService,
  TuiLoaderModule,
} from '@taiga-ui/core'

import {
  Component,
  OnDestroy,
  OnInit,
  effect,
  inject,
  untracked,
  AfterViewInit,
} from '@angular/core'

import { TuiPreviewModule } from '@taiga-ui/addon-preview'
import { HttpErrorResponse } from '@angular/common/http'
import { Router, RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'
import { Subscription } from 'rxjs'
import * as VKID from '@vkid/sdk'

import { env } from '@env'

import {
  AuthService,
  ConfigService,
  PwaService,
  ScrollService,
} from '@services'
import { inOutAnimation200, inOutAnimation500 } from '@animations'
import { ScrollNearEndDirective } from '@directives'
import { TuiPdfViewerModule } from '@taiga-ui/kit'
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
    TuiPreviewModule,
    TuiPdfViewerModule,
    TuiLoaderModule,
    HeaderComponent,
    NavComponent,
    OopsComponent,
    MenuComponent,
    ScrollNearEndDirective,
  ],
  animations: [inOutAnimation200, inOutAnimation500],
  providers: [ScrollNearEndDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
@Sentry.TraceClass({ name: 'App' })
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private alerts = inject(TuiAlertService)
  private scroll = inject(ScrollService)
  private pwa = inject(PwaService)
  private router = inject(Router)
  config = inject(ConfigService)
  auth = inject(AuthService)

  private subs: Subscription[] = []

  constructor() {
    effect(() => {
      if (this.auth.$isAuth()) {
        const { first_name, username } = untracked(this.auth.$user)

        this.subs.push(
          this.alerts.open(`Привет, ${first_name || username}!`).subscribe()
        )

        if (getCurrentPath(this.router).includes('/auth')) {
          this.router.navigate(['/'])
        }
      }
    }, {})
  }

  @Sentry.TraceMethod({ name: 'App.ngOnInit' })
  ngOnInit(): void {
    VKID.Config.set({
      app: env.appId,
      redirectUrl: env.redirectUrl,
      state: 'dj29fnsadjsd82f249k293c139j1kd3',
    })

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

  @Sentry.TraceMethod({ name: 'App.ngOnAfterViewInit' })
  ngAfterViewInit() {
    this.pwa.update()
  }

  nearEnd(posY: number) {
    this.scroll.next(true, posY)
  }

  @Sentry.TraceMethod({ name: 'App.ngOnDestroy' })
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe())
  }
}
