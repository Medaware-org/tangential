import {Injectable} from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private messageService: MessageService) {
  }

  ok(title: string, description: string) {
    this.messageService.add({
      summary: title, detail: description,
      severity: 'success'
    })
  }

  err(title: string, description: string) {
    this.messageService.add({
      summary: title, detail: description,
      severity: 'error'
    })
  }

}
