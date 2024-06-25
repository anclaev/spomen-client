import { TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core'
import { TuiAvatarModule, TuiLineClampModule } from '@taiga-ui/kit'
import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'

import { AuthService, MenuService } from '@services'

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
export class HeaderComponent {
  user = inject(AuthService).$user
  menu = inject(MenuService)

  isOpenProfileMenu = false
}
