import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './login.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.googleLogin();
  }

}
