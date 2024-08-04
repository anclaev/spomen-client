import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { inject, Injectable, Injector } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'
import { TuiAlertService } from '@taiga-ui/core'
import { map } from 'rxjs'

import { ConfirmAlertComponent } from '@components/confirm-alert'

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private alerts = inject(TuiAlertService)
  private updates = inject(SwUpdate)
  private injector = inject(Injector)

  update() {
    return this.updates.versionUpdates.subscribe((e) => {
      switch (e.type) {
        case 'VERSION_DETECTED': {
          console.log(`Загрузка новой версии приложения: ${e.version.hash}`)
          break
        }
        case 'VERSION_READY': {
          console.log(`Текущая версия приложения: ${e.currentVersion.hash}`)
          console.log(`Приложение обновлено до версии: ${e.latestVersion.hash}`)

          this.alerts
            .open(
              new PolymorpheusComponent(ConfirmAlertComponent, this.injector),
              {
                label: 'Приложение обновлено',
                status: 'info',
                data: {
                  confirmMessage: 'Перезагрузить',
                },
                autoClose: (item) => false,
              }
            )
            .pipe(
              map((res: unknown) => {
                if (res) {
                  document.location.reload()
                }
              })
            )
            .subscribe()

          break
        }
        case 'VERSION_INSTALLATION_FAILED': {
          console.log(`Ошибка установки версии '${e.version.hash}': ${e.error}`)

          this.alerts
            .open(`Версия ${e.version.hash} не установлена`, {
              status: 'error',
            })
            .subscribe()
        }
      }
    })
  }
}
