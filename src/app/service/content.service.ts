import {Injectable, signal, WritableSignal} from '@angular/core';
import {
  ArticleResponse,
  ElementResponse,
  MetadataEntry,
  TangentialContentService,
  TopicResponse,
  TopicsService
} from "../openapi";
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

  public selectedElementMetadata: WritableSignal<MetadataEntry[]> = signal([])

  public selectedArticle: WritableSignal<string | undefined> = signal(undefined)
  public selectedArticleRef: WritableSignal<ArticleResponse | undefined> = signal(undefined)

  public topics: WritableSignal<TopicResponse[]> = signal([])
  public topicsLoading: WritableSignal<boolean> = signal(false)

  constructor(private tangentialContent: TangentialContentService, private feedbackService: FeedbackService, private topicService: TopicsService) {
  }

  selectArticleInitRef(id: string, then: () => void = () => {
  }) {
    this.loadArticles(false, "", () => {
      this.selectedArticleRef.set(this.articles().find((it) => it.id == id))
      this.selectedArticle.set(id)
      then()
    })
  }

  reloadArticleData() {
    if (!this.selectedArticle())
      return

    this.loadArticles(false, "", () => {
      this.selectedArticleRef.set(this.articles().find((it) => it.id == this.selectedArticle()))
      this.selectedArticle.set(this.selectedArticle())
    })
  }

  loadArticles(onlyOwn: boolean, query: string, then: () => void = () => {
  }, setLoadingState: boolean = false) {
    if (setLoadingState)
      this.articlesLoading.set(true)
    // this.articles.set([])
    this.tangentialContent.listArticles(onlyOwn ? "current" : "all", query.trim()).subscribe({
      next: articles => {
        this.articles.set(articles)
        then()
        this.articlesLoading.set(false)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.articlesLoading.set(false)
      }
    })
  }

  loadTopics() {
    this.topicsLoading.set(false)
    this.topicService.getAllTopics().subscribe({
      next: topics => {
        this.topics.set(topics)
        console.log(topics)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.topicsLoading.set(false)
      }
    })
  }

  createTopic(name: string, description: string, color: string) {
    this.topicService.createNewTopic({
      name: name,
      description: description,
      color: color
    }).subscribe({
      next: a => {
        this.loadTopics()
        this.feedbackService.ok("Topic Created", `Successfully created topic \"${name}\"`)
      },
      error: err => {
        this.feedbackService.catalystError(err)
      }
    })
  }

  selectElement(element: ElementResponse) {
    this.selectedElement.set(element)
    this.highlightSelectedElement()
    this.loadMetadataOfSelectedElement()
  }

  highlightSelectedElement() {
    let element = this.selectedElement()
    if (!element)
      return
    let domElements = document.getElementsByClassName(`tan-${element.handle}`)
    if (domElements.length != 1)
      return
    let domElement = domElements[0]
    domElement.classList.remove("editor-tan-highlight")
    domElement.classList.add("editor-tan-highlight")
    setTimeout(() => {
      domElement.classList.remove("editor-tan-highlight")
    }, 500)
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

  loadElements() {
    if (!this.selectedArticle())
      return

    this.elementsLoading.set(true)
    this.tangentialContent.getArticleElements(this.selectedArticle()!).subscribe({
      next: elements => {
        this.elements.set(elements)
        this.loadMetadataOfSelectedElement()
        this.elementsLoading.set(false)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.elementsLoading.set(false)
      }
    })
  }

  render() {
    if (!this.selectedArticle())
      return

    this.rendererRunning.set(true)
    this.tangentialContent.renderArticle(this.selectedArticle()!).subscribe({
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

  createElement(handle: string, type: string) {
    if (!this.selectedArticle())
      return

    this.tangentialContent.insertElement({
      article: this.selectedArticle()!,
      after: this.elements()[this.elements().length - 1].id,
      handle: handle,
      type: type
    }).subscribe({
      next: resp => {
        this.loadElements()
        this.render()
      },
      error: err => {
        this.feedbackService.catalystError(err)
      }
    })
  }

  loadMetadataOfSelectedElement() {
    if (!this.selectedElement())
      return

    this.tangentialContent.getMetadata(this.selectedElement()!.id).subscribe({
      next: listing => {
        this.selectedElementMetadata.set(listing)
      },
      error: err => {
        this.feedbackService.catalystError(err)
      }
    })
  }

  changeElementType(id: string, newType: string) {
    this.tangentialContent.alterElement({
      id: id,
      type: newType
    }).subscribe({
      next: resp => {
        this.loadElements()
        this.loadMetadataOfSelectedElement()
        this.render()
        this.feedbackService.ok("Type changed", `Changed element type to ${newType}`)
      },
      error: err => {
        this.feedbackService.catalystError(err)
      }
    })
  }

  putMeta(id: string, key: string, value: string) {
    this.tangentialContent.putMetadata(id, {
      key, value
    }).subscribe({
      next: resp => {
        this.loadElements()
        this.loadMetadataOfSelectedElement()
        this.render()
        this.feedbackService.ok("Success!", `Meta entry ${key} changed!`)
      },
      error: err => {
        this.feedbackService.catalystError(err)
      }
    })
  }

  deleteElement(id: string) {
    this.tangentialContent.deleteElement({
      id
    }).subscribe({
      next: resp => {
        if (id == this.selectedElement()?.id)
          this.selectedElement.set(undefined)
        this.loadElements()
        this.render()
        this.feedbackService.ok("Element removed", "Successfully removed element")
      },
      error: err => {
        this.feedbackService.catalystError(err)
      }
    })
  }

  renameArticle(newTitle: string, then: () => void = () => {
  }) {
    if (!this.selectedArticle())
      return

    this.tangentialContent.updateArticle({
      id: this.selectedArticle()!,
      title: newTitle
    }).subscribe({
      next: resp => {
        then()
        this.loadElements()
        this.render()
        this.feedbackService.ok("Article renamed", `The article was successfully renamed to "${newTitle}"`)
      },
      error: err => {
        this.feedbackService.catalystError(err)
      }
    })
  }

}
