import { Component, OnInit } from '@angular/core'
import * as VKID from '@vkid/sdk'

@Component({
  selector: 'spomen-sign-in',
  standalone: true,
  imports: [],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  floatingOneTap = new VKID.FloatingOneTap()

  ngOnInit(): void {
    this.floatingOneTap.render({
      appName: 'Spomen',
      scheme: VKID.Scheme.DARK,
      lang: VKID.Languages.RUS,
    })
  }
}
