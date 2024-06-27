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
import {
  TuiAlertService,
  TuiDialogModule,
  TuiDialogService,
} from '@taiga-ui/core'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { Observable, map, of, switchMap } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Apollo } from 'apollo-angular'

import { getAccountQuery, GetAccountModel } from '@graphql'
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
  alerts = inject(TuiAlertService)
  destroyRef = inject(DestroyRef)
  route = inject(ActivatedRoute)
  injector = inject(Injector)
  auth = inject(AuthService)
  apollo = inject(Apollo)
  title = inject(Title)

  $profile: WritableSignal<Account> = signal(initialAccount)
  $loading: WritableSignal<boolean> = signal(true)
  $query: WritableSignal<string> = signal('')

  $$roles: Observable<Role[]> = toObservable(this.$profile).pipe(
    map((acc) => acc.roles)
  )

  $$isMe = this.route.params.pipe(
    map((params) => {
      this.$query.set(params['username'])
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
          return
        }

        this.apollo
          .watchQuery<GetAccountModel, { username: string }>({
            query: getAccountQuery,
            variables: {
              username: this.$query(),
            },
          })
          .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: ({ data, loading }) => {
              this.$loading.set(loading)
              this.$profile.set({
                ...data,
                avatar:
                  data.avatar && data.avatar.upload
                    ? data.avatar.upload.url
                    : null,
                full_name:
                  data.first_name && data.last_name
                    ? `${data.first_name.trim()} ${data.last_name.trim()}`
                    : null,
              })
            },
            error: () => {
              this.alerts
                .open('Сервер временно недоступен', { status: 'error' })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe()
            },
          })
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
        switchMap((isMe) =>
          isMe || this.auth.$user().roles.includes(Role.Administrator)
            ? this.changeAvatarDialog
            : of(null)
        )
      )
      .subscribe()
  }
}
