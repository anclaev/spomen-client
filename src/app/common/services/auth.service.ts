import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core'

import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  switchMap,
  throwError,
} from 'rxjs'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { toObservable } from '@angular/core/rxjs-interop'

import { AuthenticatedUser, initialAuthenticatedUser } from '@interfaces'
import { AuthCallbackDto, SignUpDto, SignInDto } from '@dtos'
import { AuthModel } from '@models'

import { API } from '@enums'

import { env } from '@env'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient)

  $user: WritableSignal<AuthenticatedUser> = signal(initialAuthenticatedUser)

  $isAuth: Signal<boolean> = computed(() => !!this.$user().id)
  $$isAuth: Observable<boolean> = toObservable(this.$isAuth)

  $loading = new BehaviorSubject<any>(false)
  $$loading: Observable<any> = this.$loading.asObservable()

  set(data: AuthModel) {
    this.$user.set({
      id: data.id,
      username: data.username,
      token: data.access_token,
      roles: data.roles.sort((a, b) => a.localeCompare(b)),
      vk_id: data.vk_id || null,
      avatar: data.avatar_id || data.vk_avatar || null,
      email: data.email || null,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      full_name:
        data.first_name && data.last_name
          ? `${data.first_name.trim()} ${data.last_name.trim()}`
          : null,
    })
  }

  clear() {
    this.$user.set(initialAuthenticatedUser)
  }

  init(): Observable<AuthModel> {
    this.$loading.next(true)

    return this.me().pipe(
      map((data) => {
        this.set(data)
        return data
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return this.refresh().pipe(
            switchMap(() => this.me().pipe(map((val) => val)))
          )
        }

        return throwError(() => err)
      })
    )
  }

  signIn(dto: SignInDto): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${env.apiUrl}${API.AUTH_SIGN_IN}`, dto)
  }

  signUp(dto: SignUpDto): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${env.apiUrl}${API.AUTH_SIGN_UP}`, dto)
  }

  signOut(): Observable<boolean> {
    return this.http.post<boolean>(`${env.apiUrl}${API.AUTH_SIGN_OUT}`, {})
  }

  signInVK(dto: AuthCallbackDto): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${env.apiUrl}${API.AUTH_SIGN_IN_VK}`, dto)
  }

  me(): Observable<AuthModel> {
    return this.http.get<AuthModel>(`${env.apiUrl}${API.AUTH_ME}`)
  }

  refresh(): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${env.apiUrl}${API.AUTH_REFRESH}`, {})
  }
}
