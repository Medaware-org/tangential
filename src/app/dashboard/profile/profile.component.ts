import {Component} from '@angular/core';
import {ChipsModule} from "primeng/chips";
import {FloatLabelModule} from "primeng/floatlabel";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {LoginService} from "../../service/login.service";
import {Button} from "primeng/button";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ChipsModule,
    FloatLabelModule,
    ReactiveFormsModule,
    NgClass,
    Button,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  profileDetails = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    displayName: new FormControl("", [Validators.required])
  })

  constructor(private loginService: LoginService) {
    this.insertInitialValues()
  }

  insertInitialValues() {
    this.profileDetails.setValue({
      firstName: this.loginService.currentUser?.firstName || "",
      lastName: this.loginService.currentUser?.lastName || "",
      displayName: this.loginService.currentUser?.displayName || ""
    })
  }

  cancelEdits() {
    this.profileDetails.reset()
    this.insertInitialValues()
  }

}
