import { Injectable, WritableSignal, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NavigationEnd, Router } from '@angular/router'
import { filter, firstValueFrom, map } from 'rxjs'
import { env } from '@env'

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private router = inject(Router)
  private http = inject(HttpClient)

  $isNotFoundPage: WritableSignal<boolean> = signal(false)
  $isRefusedPage: WritableSignal<boolean> = signal(false)
  $menuIsOpen: WritableSignal<boolean> = signal(false)

  constructor() {
    this.router.events
      .pipe(
        filter((val) => val instanceof NavigationEnd),
        map((a: any) => {
          if (a.url && a.urlAfterRedirects) {
            this.$isNotFoundPage.set(
              a.url.includes('/404') || a.urlAfterRedirects.includes('/404')
            )
          }
        })
      )
      .subscribe()
  }

  async loadConfig(): Promise<void> {
    const config = await firstValueFrom(this.http.get('/assets/config.json'))
    Object.assign(env, config)
  }

  toggleMenuStatus() {
    this.$menuIsOpen.set(!this.$menuIsOpen())
  }

  closeMenu() {
    if (this.$menuIsOpen()) {
      this.$menuIsOpen.set(false)
    }
  }
}
