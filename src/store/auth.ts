import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals'

import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { CookieService } from 'ngx-cookie-service'
import { computed, inject } from '@angular/core'
import { tapResponse } from '@ngrx/operators'

import { AuthService } from '@common/services/auth.service'

import { Auth } from '@tps/models/Auth'
import { AuthState } from '@tps/store'

const initialState: AuthState = {
  id: null,
  vk_id: null,
  username: null,
  email: null,
  roles: [],
  avatar: null,
  first_name: null,
  last_name: null,
  token: null,
  loading: false,
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed<boolean>(() => !!store.id()),
    avatar: computed<string | null>(() => store.avatar()),
    name: computed<string>(
      () => `${store.first_name() || ''} ${store.last_name() || ''}`
    ),
  })),
  withMethods(
    (store, auth = inject(AuthService), cookie = inject(CookieService)) => ({
      initSession: rxMethod<string>(
        pipe(
          distinctUntilChanged(),
          tap(() => patchState(store, { loading: true })),
          switchMap(() => {
            return auth.me().pipe(
              tapResponse({
                next: (data) =>
                  patchState(store, () => ({
                    id: data.id,
                    vk_id: data.vk_id,
                    username: data.username,
                    email: data.email,
                    roles: data.roles,
                    avatar: data.avatar_id || data.vk_avatar || null,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    token: data.access_token,
                    loading: false,
                  })),
                error: () => {
                  patchState(store, { loading: false })
                },
              })
            )
          })
        )
      ),
      setSession(data: Auth): void {
        patchState(store, (state) => ({
          ...state,
          id: data.id,
          vk_id: data.vk_id,
          username: data.username,
          email: data.email,
          roles: data.roles,
          avatar: data.avatar_id || data.vk_avatar || null,
          first_name: data.first_name,
          last_name: data.last_name,
          token: data.access_token,
        }))
      },
      clearSession(): void {
        patchState(store, (state) => ({ ...state, ...initialState }))
      },
    })
  )
)
