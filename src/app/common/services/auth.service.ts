import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { env } from '@env'

import { AuthenticatedUser } from '@tps/interfaces/authenticated-user'
import { SignInDto } from '@tps/dto/sign-in.dto'
import { SignUpDto } from '@tps/dto/sign-up.dto'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
  }),
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signIn(dto: SignInDto): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>(
      `${env.apiUrl}/auth/sign-in`,
      {
        ...dto,
      },
      httpOptions
    )
  }

  signUp(dto: SignUpDto): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>(
      `${env.apiUrl}/auth/sign-up`,
      {
        ...dto,
      },
      httpOptions
    )
  }
}
