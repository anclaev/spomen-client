import {
  Component,
  DestroyRef,
  Injector,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core'

import {
  TuiAlertService,
  TuiDialogModule,
  TuiDialogService,
  TuiHintModule,
  TuiSvgModule,
} from '@taiga-ui/core'

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { TuiChipModule, TuiSkeletonModule } from '@taiga-ui/experimental'
import { TuiAvatarModule, TuiLineClampModule } from '@taiga-ui/kit'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { CommonModule, DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { ApolloError } from '@apollo/client/errors'
import { Title } from '@angular/platform-browser'
import * as Sentry from '@sentry/angular'
import { Apollo } from 'apollo-angular'
import { Observable, map } from 'rxjs'

import { getAccountQuery, GetAccountModel } from '@graphql'
import { isNotFound, serializeRole } from '@utils'
import { AuthService } from '@services'
import { SexPipe } from '@pipes'

import { Account, Sex, initialAccount } from '@interfaces'

import { Role } from '@enums'

import { ChangeAvatarComponent } from './change-avatar/change-avatar.component'

const sexIcons = {
  0: '/images/tor.svg',
  1: '/images/man.svg',
  2: '/images/woman.svg',
}

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
    TuiSvgModule,
    TuiHintModule,
    SexPipe,
  ],
  providers: [DatePipe],
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
  $isMe: WritableSignal<boolean> = signal(false)
  $query: WritableSignal<string> = signal('')

  $avatar: Signal<string | null> = computed(
    () => this.$profile().avatar || this.$profile().vk_avatar
  )

  $$roles: Observable<Role[]> = toObservable(this.$profile).pipe(
    map((profile) => profile.roles)
  )

  $$isMe: Observable<boolean> = this.route.params.pipe(
    map((params) => {
      this.$query.set(params['username'])
      this.$isMe.set(params['username'] === this.auth.$user().username)
      return this.$isMe()
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
                birthday: account.birthday || null,
                avatar: account.avatar ? account.avatar.url : null,
                vk_avatar: account.vk_avatar || null,
                full_name:
                  account.first_name && account.last_name
                    ? `${account.first_name.trim()} ${account.last_name.trim()}`
                    : null,
              })
            },
            error: (err: ApolloError) => {
              console.log(err.stack)
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

  changeAvatar() {
    this.showChangeAvatarDialog().subscribe((res: string | boolean | null) => {
      if (res) {
        this.alerts
          .open(
            `Аватар успешно ${typeof res === 'string' ? 'изменён' : 'удалён'}`,
            { status: 'success' }
          )
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe()

        this.$profile.update((profile) => ({
          ...profile,
          avatar: typeof res === 'string' ? res : null,
        }))

        if (this.$isMe()) {
          this.auth.$user.update((user) => ({
            ...user,
            avatar: typeof res === 'string' ? res : null,
          }))
        }
      }
    })
  }

  serializeRole(role: Role) {
    return serializeRole(role)
  }

  serializeSex(sex: Sex | null): string {
    return sex ? sexIcons[sex] : sexIcons[0]
  }

  private showChangeAvatarDialog = () =>
    this.dialogs.open<string | null>(
      new PolymorpheusComponent(ChangeAvatarComponent, this.injector),
      {
        size: 's',
        data: {
          accountId: this.$profile().id,
          avatarAlreadyExists: !!this.$profile().avatar,
        },
      }
    )
}
