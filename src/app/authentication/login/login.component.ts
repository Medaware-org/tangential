import { Component } from '@angular/core';
import {CardModule} from "primeng/card";
import {InputGroupModule} from "primeng/inputgroup";
import {ChipsModule} from "primeng/chips";
import {FloatLabelModule} from "primeng/floatlabel";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    InputGroupModule,
    ChipsModule,
    FloatLabelModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
