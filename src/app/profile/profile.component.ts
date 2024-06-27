import {
  Component,
  DestroyRef,
  Injector,
  OnInit,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core'

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { TuiChipModule, TuiSkeletonModule } from '@taiga-ui/experimental'
import { TuiAvatarModule, TuiLineClampModule } from '@taiga-ui/kit'
import { TuiDialogModule, TuiDialogService } from '@taiga-ui/core'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Observable, map, of, switchMap } from 'rxjs'

import { AuthService } from '@services'
import { serializeRole } from '@utils'

import { Account, initialAccount } from '@interfaces'
import { Role } from '@enums'

import { ChangeAvatarComponent } from './change-avatar/change-avatar.component'

@Component({
  selector: 'spomen-profile',
  standalone: true,
  imports: [
    CommonModule,
    TuiAvatarModule,
    TuiSkeletonModule,
    TuiDialogModule,
    TuiChipModule,
    TuiLineClampModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  dialogs = inject(TuiDialogService)
  destroyRef = inject(DestroyRef)
  route = inject(ActivatedRoute)
  injector = inject(Injector)
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

  private readonly changeAvatarDialog = this.dialogs.open(
    new PolymorpheusComponent(ChangeAvatarComponent, this.injector),
    {
      size: 's',
    }
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

  changeAvatar() {
    this.$$isMe
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((isMe) => (isMe ? this.changeAvatarDialog : of(null)))
      )
      .subscribe()
  }
}
