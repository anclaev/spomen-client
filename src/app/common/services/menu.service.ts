import { Injectable, WritableSignal, signal } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  $isOpen: WritableSignal<boolean> = signal(false)

  toggle() {
    this.$isOpen.set(!this.$isOpen())
  }
}
