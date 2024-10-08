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

  deleteArticle(article: ArticleResponse, then: () => void = () => {
  }) {
    this.tangentialContent.deleteArticle({
      id: article.id!
    }).subscribe({
      next: _ => {
        this.feedbackService.ok("Article removed", `Successfully removed article '${article.title}' by '${article.author}'`)
        then()
      },
      error: err => {
        this.feedbackService.catalystError(err)
      }
    })
  }

}
