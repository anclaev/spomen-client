import { signalStore, withComputed, withState } from '@ngrx/signals'
import { computed } from '@angular/core'

import { AuthState } from '@tps/store'

const initialState: AuthState = {
  id: null,
  login: null,
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed<boolean>(() => !!store.id()),
  }))
)
