import {Component, EventEmitter, Output} from '@angular/core';
import {CardModule} from "primeng/card";
import {InputGroupModule} from "primeng/inputgroup";
import {ChipsModule} from "primeng/chips";
import {FloatLabelModule} from "primeng/floatlabel";
import {Button} from "primeng/button";
import {FeedbackService} from "../../service/feedback.service";
import {TangentialService} from "../../openapi";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../../service/login.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    InputGroupModule,
    ChipsModule,
    FloatLabelModule,
    Button,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  protected loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(protected loginService: LoginService) {
  }

  login() {
    this.loginService.login(this.loginForm.get('username')?.value || "", this.loginForm.get('password')?.value || "")
  }

}
