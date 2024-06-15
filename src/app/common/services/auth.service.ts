import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { env } from '@env'

import { AuthCallbackResponse } from '@tps/dto/auth-callback'
import { SignInDto } from '@tps/dto/sign-in.dto'
import { SignUpDto } from '@tps/dto/sign-up.dto'
import { Auth } from '@tps/models/Auth'

const getHttpOptions = (token?: string) => {
  {
    const httpHeaders: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
    }

    if (token) httpHeaders['Authorization'] = `Bearer ${token}`

    return {
      headers: new HttpHeaders({
        ...httpHeaders,
      }),
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signIn(dto: SignInDto): Observable<Auth> {
    return this.http.post<Auth>(
      `${env.apiUrl}/auth/sign-in`,
      {
        ...dto,
      },
      getHttpOptions()
    )
  }

  signUp(dto: SignUpDto): Observable<Auth> {
    return this.http.post<Auth>(
      `${env.apiUrl}/auth/sign-up`,
      {
        ...dto,
      },
      getHttpOptions()
    )
  }

  signInVK(dto: AuthCallbackResponse): Observable<Auth> {
    return this.http.post<Auth>(
      `${env.apiUrl}/auth/vkid`,
      {
        ...dto,
      },
      getHttpOptions()
    )
  }

  verifyAuth(token: string): Observable<Auth> {
    return this.http.get<Auth>(`${env.apiUrl}/auth`, getHttpOptions(token))
  }
}
