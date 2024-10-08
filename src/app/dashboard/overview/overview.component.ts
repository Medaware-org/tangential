import {Component} from '@angular/core';
import {TableModule} from "primeng/table";
import {ContentService} from "../../service/content.service";
import {Button} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {ArticleResponse} from "../../openapi";

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
    ConfirmDialogModule
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

  constructor(protected contentService: ContentService, private confirmationService: ConfirmationService) {
    this.reloadArticles()
  }

  reloadArticles() {
    this.contentService.loadArticles(this.articleSelector == this.selectorChoices[0])
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

}
