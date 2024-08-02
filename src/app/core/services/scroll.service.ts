import { Injectable, signal, WritableSignal } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { debounceTime, filter, Observable } from 'rxjs'

type ScrollState = {
  posY: number
  isEnd: boolean
}

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private $state: WritableSignal<ScrollState> = signal({
    posY: 0,
    isEnd: false,
  })

  isEnd: Observable<ScrollState> = toObservable(this.$state).pipe(
    filter((val) => val.isEnd),
    debounceTime(1000),
    filter((val) => val.posY < 0)
  )

  next(status: boolean, posY: number) {
    this.$state.set({
      isEnd: status,
      posY,
    })
  }
}
