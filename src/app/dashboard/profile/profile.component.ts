import {ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import {ChipsModule} from "primeng/chips";
import {FloatLabelModule} from "primeng/floatlabel";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {AccountService} from "../../service/account.service";
import {Button} from "primeng/button";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {SpinnerModule} from "primeng/spinner";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ChipsModule,
    FloatLabelModule,
    ReactiveFormsModule,
    NgClass,
    Button,
    NgIf,
    ProgressSpinnerModule,
    SpinnerModule,
    DialogModule
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

  constructor(protected accountService: AccountService) {
    this.insertInitialValues()
  }

  insertInitialValues() {
    this.profileDetails.setValue({
      firstName: this.accountService.currentUser?.firstName || "",
      lastName: this.accountService.currentUser?.lastName || "",
      displayName: this.accountService.currentUser?.displayName || ""
    })
  }

  cancelEdits() {
    this.profileDetails.reset()
    this.insertInitialValues()
  }

  updatedFieldValue(fieldName: string): string | undefined {
    let field = this.profileDetails.get(fieldName)
    if (!field || !field.dirty)
      return undefined
    return field.value
  }

  commitProfileUpdates() {
    this.accountService.updateUserDetails({
      firstName: this.updatedFieldValue("firstName"),
      lastName: this.updatedFieldValue("lastName"),
      displayName: this.updatedFieldValue("displayName")
    }, () => {
      this.profileDetails.reset()
      this.insertInitialValues()
    })
  }

}
