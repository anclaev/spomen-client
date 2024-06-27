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
export class ProfileComponent implements OnInit {
  dialogs = inject(TuiDialogService)
  alerts = inject(TuiAlertService)
  destroyRef = inject(DestroyRef)
  route = inject(ActivatedRoute)
  injector = inject(Injector)
  auth = inject(AuthService)
  apollo = inject(Apollo)
  router = inject(Router)
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
              const { account } = data

              this.$loading.set(loading)

              this.$profile.set({
                ...account,
                avatar:
                  account.avatar && account.avatar.upload
                    ? account.avatar.upload.url
                    : null,
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
