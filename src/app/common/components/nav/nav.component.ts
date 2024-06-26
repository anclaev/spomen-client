import { RouterLink, RouterLinkActive } from '@angular/router'
import { Component, inject } from '@angular/core'
import { TuiSvgModule } from '@taiga-ui/core'

import { ConfigService } from '@services'

@Component({
  selector: 'spomen-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TuiSvgModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  config = inject(ConfigService)
}
