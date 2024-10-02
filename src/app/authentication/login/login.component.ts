import { Component } from '@angular/core';
import {CardModule} from "primeng/card";
import {InputGroupModule} from "primeng/inputgroup";
import {ChipsModule} from "primeng/chips";
import {FloatLabelModule} from "primeng/floatlabel";
import {Button} from "primeng/button";
import {FeedbackService} from "../../service/feedback.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    InputGroupModule,
    ChipsModule,
    FloatLabelModule,
    Button
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private feedbackService: FeedbackService) {
  }

  showStuff() {
    this.feedbackService.ok("Stuff", "Lorem ipsum dolor sit amet")
  }

}
