import {
  Component,
  DestroyRef,
  OnInit,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core'

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { TuiChipModule, TuiSkeletonModule } from '@taiga-ui/experimental'
import { TuiAvatarModule, TuiLineClampModule } from '@taiga-ui/kit'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Observable, map } from 'rxjs'

import { AuthService } from '@services'
import { serializeRole } from '@utils'

import { Account, initialAccount } from '@interfaces'
import { Role } from '@enums'

@Component({
  selector: 'spomen-profile',
  standalone: true,
  imports: [
    CommonModule,
    TuiAvatarModule,
    TuiSkeletonModule,
    TuiChipModule,
    TuiLineClampModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  destroyRef = inject(DestroyRef)
  route = inject(ActivatedRoute)
  auth = inject(AuthService)
  title = inject(Title)

  $loading: WritableSignal<boolean> = signal(true)

  $profile: WritableSignal<Account> = signal(initialAccount)

  $$roles: Observable<Role[]> = toObservable(this.$profile).pipe(
    map((acc) => acc.roles)
  )

  $$isMe = this.route.params.pipe(
    map((params) => {
      return params['username'] === this.auth.$user().username
    })
  )

  constructor() {
    effect(() => {
      if (this.$profile()) {
        const profile = this.$profile()

        this.title.setTitle(profile!.full_name || profile!.username || '')
      }
    })
  }

  ngOnInit(): void {
    this.$$isMe.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (isMe) => {
        if (isMe) {
          this.$profile.set(this.auth.$user())
          this.$loading.set(false)
        }
      },
    })
  }

  serializeRole(role: Role) {
    return serializeRole(role)
  }
}
