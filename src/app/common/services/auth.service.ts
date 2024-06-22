import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { env } from '@env'

import { AuthCallbackResponse } from '@tps/dto/auth-callback'
import { SignInDto } from '@tps/dto/sign-in.dto'
import { SignUpDto } from '@tps/dto/sign-up.dto'
import { Auth } from '@tps/models/Auth'

// const httpOptions = {
//   headers: {
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Credentials': 'true',
//     'Access-Control-Allow-Origin': 'http://localhost',
//   },
// }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient)

  signIn(dto: SignInDto): Observable<Auth> {
    return this.http.post<Auth>(`${env.apiUrl}/auth/sign-in`, dto)
  }

  signUp(dto: SignUpDto): Observable<Auth> {
    return this.http.post<Auth>(`${env.apiUrl}/auth/sign-up`, dto)
  }

  signInVK(dto: AuthCallbackResponse): Observable<Auth> {
    return this.http.post<Auth>(`${env.apiUrl}/auth/vkid`, dto)
  }

  me(): Observable<Auth> {
    return this.http.get<Auth>(`${env.apiUrl}/auth`)
  }
}
