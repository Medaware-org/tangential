import {Component, signal} from '@angular/core';
import {Button} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {ConfirmationService, PrimeTemplate} from "primeng/api";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {TableModule} from "primeng/table";
import {ContentService} from "../../service/content.service";
import {NgStyle} from "@angular/common";
import {CalendarModule} from "primeng/calendar";
import {ColorPickerModule} from "primeng/colorpicker";
import {TooltipModule} from "primeng/tooltip";
import {TopicResponse, TopicsService} from "../../openapi";

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
    ColorPickerModule,
    TooltipModule
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

  protected topicEditDialogVisible = false
  protected topicEditForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    color: new FormControl('#a29bfe', [Validators.required])
  })
  protected topicEditId: string = ""

  constructor(protected contentService: ContentService, protected confirmationService: ConfirmationService, protected topicService: TopicsService) {
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

  deleteTopic(topic: TopicResponse) {
    this.confirmationService.confirm({
      header: `Delete Topic?`,
      message: `Are you sure that you want to delete topic "${topic.name}" ?`,
      accept: () => {
        this.topicService.deleteTopic({
          id: topic.id
        }).subscribe({
          next: () => {
            this.reloadTopics()
          }
        })
      }
    })
  }

  submitTopicEdit() {
    this.topicService.updateTopic({
      id: this.topicEditId,
      name: this.topicEditForm.get('name')?.value!!,
      description: this.topicEditForm.get('description')?.value!!,
      color: this.topicEditForm.get('color')?.value!!,
    }).subscribe({
      next: () => {
        this.reloadTopics()
        this.topicEditDialogVisible = false
      }
    })
  }

  initTopicEdit(topic: TopicResponse) {
    this.topicEditId = topic.id
    this.topicEditForm.setValue({
      name: topic.name,
      description: topic.description,
      color: topic.color
    })
    this.topicEditDialogVisible = true
  }

  protected readonly top = top;
}
