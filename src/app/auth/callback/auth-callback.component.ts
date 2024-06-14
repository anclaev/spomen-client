import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { TuiLoaderModule } from '@taiga-ui/core'
import { ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common'

import { AuthPassComponent } from '@app/auth/pass/auth-pass.component'

import { AuthService } from '@common/services/auth.service'

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

  // private alerts = inject(TuiAlertService)

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true)
  isLoading$$: Observable<boolean> = this.isLoading.asObservable()

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const payload = getQueryPayload<AuthCallbackResponse>(
      this.route.snapshot.queryParams
    )!
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub) => sub.unsubscribe())
  }
}
