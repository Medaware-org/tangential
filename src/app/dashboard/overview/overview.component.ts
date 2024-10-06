import {Component} from '@angular/core';
import {TableModule} from "primeng/table";
import {ContentService} from "../../service/content.service";
import {Button} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    TableModule,
    Button,
    DropdownModule,
    DropdownModule,
    FormsModule
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

  constructor(protected contentService: ContentService) {
    this.reloadArticles()
  }

  reloadArticles() {
    this.contentService.loadArticles(this.articleSelector == this.selectorChoices[0])
  }

}
