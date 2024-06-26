import { RouterLink, RouterLinkActive } from '@angular/router'
import { TuiSvgModule } from '@taiga-ui/core'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'spomen-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TuiSvgModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  @Input() isFull: boolean = true
  @Input() isNotFound: boolean = false
}
