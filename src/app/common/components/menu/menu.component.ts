import { RouterLink, RouterLinkActive } from '@angular/router'
import { TuiSvgModule } from '@taiga-ui/core'
import { Component } from '@angular/core'

@Component({
  selector: 'spomen-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TuiSvgModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {}
