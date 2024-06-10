import { RouterModule } from '@angular/router'
import { Component } from '@angular/core'

@Component({
  selector: 'spomen-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
