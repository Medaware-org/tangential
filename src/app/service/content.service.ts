import {Injectable, signal, WritableSignal} from '@angular/core';
import {ArticleResponse, ElementResponse, TangentialContentService} from "../openapi";
import {FeedbackService} from "./feedback.service";

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  public articles: WritableSignal<ArticleResponse[]> = signal([])
  public articlesLoading: WritableSignal<boolean> = signal(false)

  public elements: WritableSignal<ElementResponse[]> = signal([])
  public elementsLoading: WritableSignal<boolean> = signal(false)
  public selectedElement: WritableSignal<ElementResponse | undefined> = signal(undefined)

  public renderedHtml: WritableSignal<string> = signal("")
  public rendererRunning: WritableSignal<boolean> = signal(false)

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

  selectElement(element: ElementResponse) {
    this.selectedElement.set(element)
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

  createArticle(title: string, then: () => void = () => {
  }) {
    this.tangentialContent.createArticle({
      title
    }).subscribe({
      next: resp => {
        this.feedbackService.ok("Article Created", `Successfully created a new article '${resp.title}'`)
        then()
      },
      error: err => {
        this.feedbackService.catalystError(err)
      }
    })
  }

  loadElements(id: string) {
    this.elementsLoading.set(true)
    this.tangentialContent.getArticleElements(id).subscribe({
      next: elements => {
        this.elements.set(elements)
        this.elementsLoading.set(false)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.elementsLoading.set(false)
      }
    })
  }

  render(id: string) {
    this.rendererRunning.set(true)
    this.tangentialContent.renderArticle(id).subscribe({
      next: html => {
        this.renderedHtml.set(html)
        this.rendererRunning.set(false)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.rendererRunning.set(false)
      }
    })
  }

}