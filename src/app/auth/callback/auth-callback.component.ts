import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { TuiLoaderModule } from '@taiga-ui/core'
import { CommonModule } from '@angular/common'

import { AuthPassComponent } from '@app/auth/pass/auth-pass.component'

import { AuthService } from '@common/services/auth.service'
import { AuthStore } from '@store/auth'

import { getQueryPayload } from '@utils/getQueryPayload'

import { AuthCallbackResponse } from '@tps/dto/auth-callback'

@Component({
  selector: 'spomen-sign-in-callback',
  standalone: true,
  imports: [CommonModule, TuiLoaderModule, AuthPassComponent, TuiLoaderModule],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss',
})
export class AuthCallbackComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private subs$: Subscription[] = []

  private store = inject(AuthStore)
  private router = inject(Router)

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true)
  isLoading$$: Observable<boolean> = this.isLoading.asObservable()

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const payload = getQueryPayload<AuthCallbackResponse>(
      this.route.snapshot.queryParams
    )!

    this.subs$.push(
      this.auth
        .signInVK({
          ...payload,
        })
        .subscribe({
          next: (data) => {
            this.store.setAuth(data)
            this.router.navigate(['/'])
          },
          error: (err) => {
            this.router.navigate(['/'])
            console.log(err)
          },
        })
    )
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub) => sub.unsubscribe())
  }
}
