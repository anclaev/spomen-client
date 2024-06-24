import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { TuiLoaderModule } from '@taiga-ui/core'
import { CommonModule } from '@angular/common'

import { AuthPassComponent } from '@app/auth/pass/auth-pass.component'

import { AuthService } from '@services/auth.service'

import { getQueryPayload } from '@utils/getQueryPayload'

import { AuthCallbackDto } from '@dto/auth-callback'

@Component({
  selector: 'spomen-sign-in-callback',
  standalone: true,
  imports: [CommonModule, TuiLoaderModule, AuthPassComponent, TuiLoaderModule],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss',
})
export class AuthCallbackComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private auth = inject(AuthService)
  private router = inject(Router)

  private subs$: Subscription[] = []

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true)
  isLoading$$: Observable<boolean> = this.isLoading.asObservable()

  ngOnInit(): void {
    const payload = getQueryPayload<AuthCallbackDto>(
      this.route.snapshot.queryParams
    )!

    this.subs$.push(
      this.auth
        .signInVK({
          ...payload,
        })
        .subscribe({
          next: (data) => {
            this.auth.set(data)
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
