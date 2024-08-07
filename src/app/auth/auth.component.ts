import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TuiTabsModule } from '@taiga-ui/kit'
import * as Sentry from '@sentry/angular'

import { enterLeaveAnimation } from '@animations'

import { SignInComponent } from './sign-in/sign-in.component'
import { SignUpComponent } from './sign-up/sign-up.component'

@Component({
  selector: 'spomen-auth',
  standalone: true,
  imports: [TuiTabsModule, SignInComponent, SignUpComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  animations: [enterLeaveAnimation],
})
@Sentry.TraceClass({ name: 'Auth' })
export class AuthComponent implements OnInit {
  route = inject(ActivatedRoute)

  activeItemIndex: number = 0
  callbackUrl: string | null = null

  @Sentry.TraceMethod({ name: 'Auth.ngOnInit' })
  ngOnInit(): void {
    this.callbackUrl = this.route.snapshot.queryParams['url'] ?? null
  }
}
