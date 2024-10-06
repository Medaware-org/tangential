import {Injectable} from '@angular/core';
import {MessageService} from "primeng/api";
import {CatalystError} from "../openapi";

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

  catalystError(error: any, handleDefault: boolean = true): boolean {
    if (error.hasOwnProperty('error'))
      return this.catalystError(error['error'], handleDefault)

    if (!error.hasOwnProperty('summary') || !error.hasOwnProperty('message')) {
      if (handleDefault)
        this.err("Error", "An error occurred")
      return false // Not a Catalyst error
    }

    let catalystError = error as CatalystError
    this.err(catalystError.summary, catalystError.message)
    return true
  }

}
