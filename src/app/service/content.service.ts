import {Injectable, signal, WritableSignal} from '@angular/core';
import {ArticleResponse, TangentialContentService} from "../openapi";
import {FeedbackService} from "./feedback.service";

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  public articles: WritableSignal<ArticleResponse[]> = signal([])
  public articlesLoading: WritableSignal<boolean> = signal(false)

  constructor(private tangentialContent: TangentialContentService, private feedbackService: FeedbackService) {
  }

  loadArticles(onlyOwn: boolean) {
    this.articlesLoading.set(true)
    this.articles.set([])
    this.tangentialContent.listArticles(onlyOwn ? "current" : "all").subscribe({
      next: articles => {
        this.articles.set(articles)
        this.articlesLoading.set(false)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.articlesLoading.set(false)
      }
    })
  }

}
