import { Component } from '@angular/core'

import { NavComponent } from '@components/nav'

@Component({
  selector: 'spomen-menu',
  standalone: true,
  imports: [NavComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {}
