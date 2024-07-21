import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'

import {
  Component,
  DestroyRef,
  Injector,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core'

import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiInputTagModule,
  TuiLineClampModule,
} from '@taiga-ui/kit'

import {
  TuiAlertService,
  TuiDialogModule,
  TuiDialogService,
  TuiDropdownModule,
  TuiHintModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core'

import {
  TuiChipModule,
  TuiIconModule,
  TuiSkeletonModule,
} from '@taiga-ui/experimental'

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { CommonModule, DatePipe } from '@angular/common'
import { Apollo, QueryRef } from 'apollo-angular'
import { RouterModule } from '@angular/router'
import * as Sentry from '@sentry/angular'

import {
  getAccountsInfoByUsernameQuery,
  getUploads,
  PaginatedQuery,
  Pagination,
} from '@graphql'

import { AccountShortModel, UploadModel } from '@models'
import { inOutGridAnimation200 } from '@animations'
import { AuthService } from '@services'

import { NotFoundComponent } from '@components/not-found/not-found.component'
import { UploadInfoComponent } from './upload-info/upload-info.component'
import { UploadFileComponent } from './upload-file/upload-file.component'

@Component({
  selector: 'spomen-uploads',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiInputTagModule,
    TuiDropdownModule,
    TuiDataListWrapperModule,
    TuiInputModule,
    TuiIconModule,
    TuiAvatarModule,
    RouterModule,
    TuiChipModule,
    TuiLineClampModule,
    TuiDialogModule,
    TuiSkeletonModule,
    TuiHintModule,
    TuiSvgModule,
    UploadInfoComponent,
    UploadFileComponent,
    NotFoundComponent,
  ],
  providers: [DatePipe],
  animations: [inOutGridAnimation200],
  templateUrl: './uploads.component.html',
  styleUrl: './uploads.component.scss',
})
@Sentry.TraceClass({ name: 'Uploads' })
export class UploadsComponent implements OnInit {
  private dialogs = inject(TuiDialogService)
  private alerts = inject(TuiAlertService)
  private destroyRef = inject(DestroyRef)
  private injector = inject(Injector)
  private apollo = inject(Apollo)

  private currentUser = inject(AuthService).$user().username

  filters: FormGroup = new FormGroup({
    username: new FormControl(),
    name: new FormControl(),
    ext: new FormControl(),
  })

  $accounts: WritableSignal<AccountShortModel[]> = signal([])
  $accountsList: Signal<string[]> = computed(() =>
    this.$accounts().map((val) => val.username)
  )
  $accountsFilter: WritableSignal<string> = signal('')
  $$accountFilter: Observable<string> = toObservable(this.$accountsFilter)

  $uploadsOwners: WritableSignal<string[]> = signal([])
  $uploadsName: WritableSignal<string> = signal('')
  $uploadsExt: WritableSignal<string[]> = signal([])

  $uploadsSize: WritableSignal<number> = signal(10)
  $uploadsPage: WritableSignal<number> = signal(1)
  $uploadsLoading: WritableSignal<boolean> = signal(true)
  $uploads: WritableSignal<UploadModel[]> = signal([])

  uploadSkeletonLimit = new Array(10)

  // tagValidator: (tag: string) => boolean = () => true

  private accountsQuery: QueryRef<
    { accounts: AccountShortModel[] },
    { username: string }
  > = this.apollo.watchQuery<
    { accounts: AccountShortModel[] },
    { username: string }
  >({
    query: getAccountsInfoByUsernameQuery,
    variables: {
      username: this.$accountsFilter(),
    },
    fetchPolicy: 'cache-first',
  })

  private uploadsQuery: PaginatedQuery<
    { uploads: UploadModel[] },
    { owner?: string[]; name?: string; ext?: string[] }
  > = this.apollo.watchQuery<
    { uploads: UploadModel[] },
    Pagination & {
      owner?: string[]
      name?: string
      ext?: string[]
    }
  >({
    query: getUploads,
    variables: {
      size: this.$uploadsSize(),
      page: this.$uploadsPage(),
      owner:
        this.$uploadsOwners().length === 0 ? undefined : this.$uploadsOwners(),
      name:
        this.$uploadsName().trim().length === 0
          ? undefined
          : this.$uploadsName(),
      ext: this.$uploadsExt().length === 0 ? undefined : this.$uploadsExt(),
    },
    fetchPolicy: 'cache-and-network',
  })

  ngOnInit(): void {
    if (this.currentUser) {
      this.filters.controls['username'].setValue([this.currentUser])
      this.$uploadsOwners.set([this.currentUser])
    }

    this.accountsQuery.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.$accounts.set(res.data.accounts)
        },
        error: () => {
          this.alerts
            .open('Сервер временно недоступен', { status: 'error' })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
        },
      })

    this.uploadsQuery.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.$uploads.set(res.data.uploads)
          this.$uploadsLoading.set(false)
        },
        error: () => {
          this.alerts
            .open('Сервер временно недоступен', { status: 'error' })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
          this.$uploadsLoading.set(false)
        },
      })

    this.$$accountFilter
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.accountsQuery.refetch({
          username: this.$accountsFilter(),
        })
      })

    this.filters.controls['username'].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((items) => {
        this.$uploadsOwners.set(items)
        this.refetchUploads()
      })

    this.filters.controls['ext'].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((items) => {
        this.$uploadsExt.set(items)
        this.refetchUploads()
      })

    this.filters.controls['name'].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((items) => {
        this.$uploadsName.set(items)
        this.refetchUploads()
      })
  }

  handleUsernameFilterChange(val: string) {
    if (val.trim().length > 0 && val.trim() !== this.$accountsFilter()) {
      this.$accountsFilter.set(val.trim())
    }
  }

  handleSetExt(ext: string) {
    const currentValue = this.filters.controls['ext'].value

    if (!currentValue) this.filters.controls['ext'].setValue([ext])

    if (Array.isArray(currentValue) && !currentValue.includes(ext.trim())) {
      this.filters.controls['ext'].setValue([
        ...this.filters.controls['ext'].value,
        ext,
      ])
    }
  }

  showUploadInfo(uploadId: string) {
    this.showUploadInfoDialog(uploadId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  showUploadFile() {
    this.showUploadFileDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  private showUploadInfoDialog = (uploadId: string) =>
    this.dialogs.open<string | null>(
      new PolymorpheusComponent(UploadInfoComponent, this.injector),
      {
        size: 's',
        data: {
          uploadId,
        },
      }
    )

  private showUploadFileDialog = () =>
    this.dialogs.open<string | null>(
      new PolymorpheusComponent(UploadFileComponent, this.injector),
      {
        size: 's',
      }
    )

  private refetchUploads() {
    this.$uploadsLoading.set(true)
    this.uploadsQuery.refetch({
      owner:
        this.$uploadsOwners().length === 0 ? undefined : this.$uploadsOwners(),
      name:
        this.$uploadsName().trim().length === 0
          ? undefined
          : this.$uploadsName().trim(),
      ext: this.$uploadsExt().length === 0 ? undefined : this.$uploadsExt(),
      page: this.$uploadsPage(),
      size: this.$uploadsSize(),
    })
  }
}
