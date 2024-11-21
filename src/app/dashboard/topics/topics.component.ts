import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {PrimeTemplate} from "primeng/api";
import {ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {TableModule} from "primeng/table";
import {ContentService} from "../../service/content.service";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    Button,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    PaginatorModule,
    PrimeTemplate,
    ReactiveFormsModule,
    SelectButtonModule,
    TableModule,
    NgStyle
  ],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss'
})
export class TopicsComponent {
  constructor(protected contentService: ContentService) {
    contentService.loadTopics()
  }

  protected readonly top = top;
}
