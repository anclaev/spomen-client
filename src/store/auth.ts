import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals'

import { distinctUntilChanged, of, pipe, switchMap, tap } from 'rxjs'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { computed, inject } from '@angular/core'
import { tapResponse } from '@ngrx/operators'

import { AuthService } from '@common/services/auth.service'

import { Auth } from '@tps/models/Auth'
import { AuthState } from '@tps/store'
import { STORE } from '@tps/constants'

const initialState: AuthState = {
  id: null,
  vk_id: null,
  login: null,
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
  withMethods((store, auth = inject(AuthService)) => ({
    initAuth: rxMethod<string>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store, { loading: true })),
        switchMap(() => {
          const token = sessionStorage.getItem(STORE.ACCESS_TOKEN)

          if (token) {
            return auth.verifyAuth(token).pipe(
              tapResponse({
                next: (data) =>
                  patchState(store, () => ({
                    id: data.id,
                    vk_id: data.vkId,
                    login: data.login,
                    email: data.email,
                    roles: data.roles,
                    avatar: data.avatarId || data.vkAvatar || null,
                    first_name: data.name,
                    last_name: data.surname,
                    token: data.access_token,
                    loading: false,
                  })),
                error: () => {
                  patchState(store, { loading: false })
                },
              })
            )
          }

          return of(null)
        })
      )
    ),
    setAuth(data: Auth): void {
      patchState(store, (state) => ({
        ...state,
        id: data.id,
        vk_id: data.vkId,
        login: data.login,
        email: data.email,
        roles: data.roles,
        avatar: data.avatarId || data.vkAvatar || null,
        first_name: data.name,
        last_name: data.surname,
        token: data.access_token,
      }))

      sessionStorage.setItem(STORE.ACCESS_TOKEN, data.access_token)
    },
    clearAuth(): void {
      patchState(store, (state) => ({ ...state, ...initialState }))
      sessionStorage.removeItem(STORE.ACCESS_TOKEN)
    },
  }))
)
