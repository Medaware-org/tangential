import {Component} from '@angular/core';
import {TableModule} from "primeng/table";
import {ContentService} from "../../service/content.service";
import {Button} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {ArticleResponse} from "../../openapi";
import {FloatLabelModule} from "primeng/floatlabel";
import {Router} from "@angular/router";
import {DockModule} from "primeng/dock";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    TableModule,
    Button,
    DropdownModule,
    DropdownModule,
    FormsModule,
    SelectButtonModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    FloatLabelModule,
    DockModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

  protected selectorChoices: string[] = [
    "Own",
    "All"
  ]

  protected articleSelector: string = this.selectorChoices[0]

  protected searchQuery: string = ""

  protected creationDialogVisible: boolean = false

  protected creationForm = new FormGroup({
    title: new FormControl('', [Validators.required])
  })

  constructor(protected contentService: ContentService, private confirmationService: ConfirmationService, private router: Router) {
    this.reloadArticles()
  }

  reloadArticles() {
    this.contentService.loadArticles(this.articleSelector === this.selectorChoices[0], this.searchQuery, () => {}, false)
  }

  deleteArticle(article: ArticleResponse) {
    this.confirmationService.confirm({
      message: `Do you really want to permanently delete '${article.title}' by '${article.author}'?`,
      accept: () => {
        this.contentService.deleteArticle(article, () => {
          this.reloadArticles()
        })
      }
    })
  }

  initArticleCreation() {
    this.creationForm.reset()
    this.creationDialogVisible = true
  }

  editArticle(id: string) {
    this.router.navigate([`/editor/${id}`])
  }

  createArticle() {
    if (this.creationForm.invalid)
      return

    this.creationDialogVisible = false
    this.contentService.createArticle(this.creationForm.get('title')?.value!, () => {
      this.reloadArticles()
    })
  }

}
