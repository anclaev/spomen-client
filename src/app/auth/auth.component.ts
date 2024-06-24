import { TuiTabsModule } from '@taiga-ui/kit'
import { Component } from '@angular/core'

import { enterLeaveAnimation } from '@animations'

import { SignInComponent } from './sign-in/sign-in.component'
import { SignUpComponent } from './sign-up/sign-up.component'

@Component({
  selector: 'spomen-auth',
  standalone: true,
  imports: [TuiTabsModule, SignInComponent, SignUpComponent],
  providers: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  animations: [enterLeaveAnimation],
})
export class AuthComponent {
  activeItemIndex = 0
}
