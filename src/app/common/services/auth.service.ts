import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core'

import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, catchError, map, switchMap, throwError } from 'rxjs'

import { env } from '@env'

import { Auth } from '@models/Auth'
import { AuthenticatedUser, initial } from '@interfaces/authenticated-user'

import { AuthCallbackDto } from '@dto/auth-callback'
import { SignInDto } from '@dto/sign-in'
import { SignUpDto } from '@dto/sign-up'

import { API } from '@enums/api.enum'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient)

  $user: WritableSignal<AuthenticatedUser> = signal(initial)
  $isAuth: Signal<boolean> = computed(() => !!this.$user().id)
  $loading: WritableSignal<boolean> = signal(false)

  set(data: Auth) {
    this.$user.set({
      id: data.id,
      username: data.username,
      token: data.access_token,
      roles: data.roles,
      vk_id: data.vk_id || null,
      avatar: data.avatar_id || data.vk_avatar || null,
      email: data.email || null,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
    })
  }

  init(): Observable<Auth> {
    return this.me().pipe(
      map((data) => {
        this.set(data)
        return data
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return this.refresh().pipe(
            switchMap(() =>
              this.me().pipe(
                map((val) => {
                  this.set(val)
                  return val
                })
              )
            )
          )
        }

        return throwError(() => new Error('Сервер недоступен'))
      })
    )
  }

  signIn(dto: SignInDto): Observable<Auth> {
    return this.http.post<Auth>(`${env.apiUrl}${API.AUTH_SIGN_IN}`, dto)
  }

  signUp(dto: SignUpDto): Observable<Auth> {
    return this.http.post<Auth>(`${env.apiUrl}${API.AUTH_SIGN_UP}`, dto)
  }

  signInVK(dto: AuthCallbackDto): Observable<Auth> {
    return this.http.post<Auth>(`${env.apiUrl}${API.AUTH_SIGN_IN_VK}`, dto)
  }

  me(): Observable<Auth> {
    return this.http.get<Auth>(`${env.apiUrl}${API.AUTH_ME}`)
  }

  refresh(): Observable<Auth> {
    return this.http.post<Auth>(`${env.apiUrl}${API.AUTH_REFRESH}`, {})
  }
}
