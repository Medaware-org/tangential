import {Component, signal} from '@angular/core';
import {Button} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {PrimeTemplate} from "primeng/api";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {TableModule} from "primeng/table";
import {ContentService} from "../../service/content.service";
import {NgStyle} from "@angular/common";
import {CalendarModule} from "primeng/calendar";
import {ColorPickerModule} from "primeng/colorpicker";

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
    NgStyle,
    CalendarModule,
    ColorPickerModule
  ],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss'
})
export class TopicsComponent {

  protected topicCreationDialogVisible = false
  protected topicCreationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    color: new FormControl('#a29bfe', [Validators.required])
  })

  constructor(protected contentService: ContentService) {
    this.reloadTopics()
  }

  reloadTopics() {
    this.contentService.loadTopics()
  }

  initTopicCreation() {
    this.topicCreationForm.reset()
    this.topicCreationDialogVisible = true
  }

  createTopic() {
    this.topicCreationDialogVisible = false
    this.contentService.createTopic(this.topicCreationForm.get('name')?.value!!, this.topicCreationForm.get('description')?.value!!, this.topicCreationForm.get('color')?.value!!)
  }
}
