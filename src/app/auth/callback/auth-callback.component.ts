import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { TuiAlertService, TuiLoaderModule } from '@taiga-ui/core'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common'

import { AuthPassComponent } from '@app/auth/pass/auth-pass.component'

import { getQueryPayload } from '@utils/getQueryPayload'

import { AuthCallbackResponse } from '@tps/dto/auth-callback'

@Component({
  selector: 'spomen-sign-in-callback',
  standalone: true,
  imports: [CommonModule, TuiLoaderModule, AuthPassComponent],
  templateUrl: './auth-callback.component.html',
})
export class AuthCallbackComponent implements OnInit, OnDestroy {
  private token: BehaviorSubject<string> = new BehaviorSubject('')
  private route = inject(ActivatedRoute)
  private subs$: Subscription[] = []

  // private alerts = inject(TuiAlertService)

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true)
  isLoading$$: Observable<boolean> = this.isLoading.asObservable()

  private showPass: BehaviorSubject<boolean> = new BehaviorSubject(false)
  showPass$$: Observable<boolean> = this.showPass.asObservable()

  ngOnInit(): void {
    const payload = getQueryPayload<AuthCallbackResponse>(
      this.route.snapshot.queryParams
    )!

    this.token.next(payload.token)
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub) => sub.unsubscribe())
  }
}
