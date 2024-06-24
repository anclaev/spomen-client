import { TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core'
import { TuiAvatarModule, TuiLineClampModule } from '@taiga-ui/kit'
import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'

import { AuthService } from '@services'

import { ProfileMenuComponent } from '@components/profile-menu'

@Component({
  selector: 'spomen-header',
  standalone: true,
  imports: [
    RouterModule,
    TuiAvatarModule,
    TuiSvgModule,
    TuiLineClampModule,
    TuiHostedDropdownModule,
    ProfileMenuComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  user = inject(AuthService).$user

  isOpenProfileMenu = false
}
