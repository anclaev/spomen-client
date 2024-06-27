import { Injectable, WritableSignal, inject, signal } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { filter, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private router = inject(Router)

  $isNotFoundPage: WritableSignal<boolean> = signal(false)
  $isRefusedPage: WritableSignal<boolean> = signal(false)
  $menuIsOpen: WritableSignal<boolean> = signal(false)

  toggleMenuStatus() {
    this.$menuIsOpen.set(!this.$menuIsOpen())
  }

  closeMenu() {
    if (this.$menuIsOpen()) {
      this.$menuIsOpen.set(false)
    }
  }

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
}
