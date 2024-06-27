import { RouterLink, RouterLinkActive } from '@angular/router'
import { Component, Input, inject } from '@angular/core'
import { TuiSvgModule } from '@taiga-ui/core'

import { AuthService, ConfigService } from '@services'
import { Route } from '@interfaces'

const protectedRoutes: Route[] = [
  {
    url: '/',
    title: 'Дашборд',
    icon: 'tuiIconAirplayLarge',
    exact: true,
  },
  {
    url: '/memories',
    title: 'Воспоминания',
    icon: 'tuiIconCalendarLarge',
  },
  {
    url: '/events',
    title: 'События',
    icon: '/images/cake.svg',
    customIcon: true,
  },
  {
    url: '/timelines',
    title: 'Таймлайны',
    icon: 'tuiIconChartLineLarge',
  },
  {
    url: '/chats',
    title: 'Чаты',
    icon: 'tuiIconMessageCircleLarge',
  },
  {
    url: '/uploads',
    title: 'Файлы',
    icon: '/images/files.svg',
    customIcon: true,
  },
]

@Component({
  selector: 'spomen-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TuiSvgModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  config = inject(ConfigService)
  auth = inject(AuthService)

  @Input() fixed: boolean = false

  authenticatedRoutes = protectedRoutes

  closeMenu() {
    if (this.config.$menuIsOpen()) {
      this.config.$menuIsOpen.set(false)
    }
  }
}
