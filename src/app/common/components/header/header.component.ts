import { TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core'
import { TuiAvatarModule, TuiLineClampModule } from '@taiga-ui/kit'
import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import * as Sentry from '@sentry/angular'

import { AuthService, ConfigService } from '@services'

import { MeComponent } from '@components/me'

@Component({
  selector: 'spomen-header',
  standalone: true,
  imports: [
    RouterModule,
    TuiAvatarModule,
    TuiSvgModule,
    TuiLineClampModule,
    TuiHostedDropdownModule,
    MeComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
@Sentry.TraceClass({ name: 'Header' })
export class HeaderComponent {
  auth = inject(AuthService)
  config = inject(ConfigService)

  isOpenProfileDropdown = false
}
