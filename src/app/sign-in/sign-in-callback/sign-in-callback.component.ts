import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

import { getQueryPayload } from '@utils/getQueryPayload'

import { SignInCallbackResponse } from '@tps/dto/sign-in-callback'

@Component({
  selector: 'spomen-sign-in-callback',
  standalone: true,
  imports: [],
  templateUrl: './sign-in-callback.component.html',
  styleUrl: './sign-in-callback.component.scss',
})
export class SignInCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute)

  private token: BehaviorSubject<string> = new BehaviorSubject('')

  ngOnInit(): void {
    const payload = getQueryPayload<SignInCallbackResponse>(
      this.route.snapshot.queryParams
    )!

    this.token.next(payload.token)
  }
}
