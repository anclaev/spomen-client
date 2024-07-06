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

import {
  TuiAlertService,
  TuiDialogModule,
  TuiDialogService,
} from '@taiga-ui/core'

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { TuiChipModule, TuiSkeletonModule } from '@taiga-ui/experimental'
import { TuiAvatarModule, TuiLineClampModule } from '@taiga-ui/kit'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, map, of, switchMap } from 'rxjs'
import { ApolloError } from '@apollo/client/errors'
import { Title } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'
import { Apollo } from 'apollo-angular'

import { getAccountQuery, GetAccountModel } from '@graphql'
import { isNotFound, serializeRole } from '@utils'
import { AuthService } from '@services'

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
@Sentry.TraceClass({ name: 'Profile' })
export class ProfileComponent implements OnInit {
  private dialogs = inject(TuiDialogService)
  private alerts = inject(TuiAlertService)
  private destroyRef = inject(DestroyRef)
  private route = inject(ActivatedRoute)
  private injector = inject(Injector)
  private apollo = inject(Apollo)
  private router = inject(Router)
  private title = inject(Title)
  auth = inject(AuthService)

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

  private readonly showChangeAvatarDialog = (
    accountId: string,
    isMe: boolean
  ) => {
    return this.dialogs.open<string | null>(
      new PolymorpheusComponent(ChangeAvatarComponent, this.injector),
      {
        size: 's',
        data: {
          accountId,
          avatarAlreadyExists: isMe
            ? !!this.auth.$user().avatar
            : !!this.$profile().avatar,
        },
      }
    )
  }

  constructor() {
    effect(() => {
      if (this.$profile()) {
        const profile = this.$profile()

        this.title.setTitle(profile!.full_name || profile!.username || '')
      }
    })
  }

  @Sentry.TraceMethod({ name: 'Profile.ngOnInit' })
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
              const { account } = data

              this.$loading.set(loading)

              this.$profile.set({
                ...account,
                avatar: account.avatar ? account.avatar.url : account.vk_avatar,
                full_name:
                  account.first_name && account.last_name
                    ? `${account.first_name.trim()} ${account.last_name.trim()}`
                    : null,
              })
            },
            error: (err: ApolloError) => {
              if (isNotFound(err.message)) {
                this.router.navigate(['/404'])
                return
              }

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
    if (!this.$profile().id) return

    this.$$isMe
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((isMe) =>
          isMe || this.auth.$isAdmin()
            ? this.showChangeAvatarDialog(this.$profile().id!, isMe)
            : of(null)
        )
      )
      .subscribe((res: string | null) => {
        this.alerts
          .open('Аватар успешно изменён', { status: 'success' })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe()

        if (res) {
          this.$profile.update((profile) => ({
            ...profile,
            avatar: res,
          }))
        }
      })
  }
}
