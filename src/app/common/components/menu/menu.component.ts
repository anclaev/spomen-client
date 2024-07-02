import { Component } from '@angular/core'
import * as Sentry from '@sentry/angular'

import { NavComponent } from '@components/nav'

@Component({
  selector: 'spomen-menu',
  standalone: true,
  imports: [NavComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
@Sentry.TraceClass({ name: 'Menu' })
export class MenuComponent {}
