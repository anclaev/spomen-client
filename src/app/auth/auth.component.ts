import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TuiTabsModule } from '@taiga-ui/kit'

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
export class AuthComponent implements OnInit {
  route = inject(ActivatedRoute)

  activeItemIndex: number = 0
  callbackUrl: string | null = null

  ngOnInit(): void {
    this.callbackUrl = this.route.snapshot.queryParams['url'] ?? null
  }
}
