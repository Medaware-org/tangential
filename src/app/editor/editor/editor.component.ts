import {AfterViewInit, Component, Input} from '@angular/core';
import {ContentService} from "../../service/content.service";
import {Button} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {Router} from "@angular/router";
import {SplitButtonModule} from "primeng/splitbutton";
import {SplitterModule} from "primeng/splitter";
import {TabViewModule} from "primeng/tabview";
import {Ripple} from "primeng/ripple";
import {MenuItem} from "primeng/api";
import {MenubarModule} from "primeng/menubar";

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    Button,
    TooltipModule,
    SplitButtonModule,
    SplitterModule,
    TabViewModule,
    Ripple,
    MenubarModule
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit {

  @Input() id!: string

  toolbarItems: MenuItem[] = [
    {
      label: "Heading",
      icon: "pi pi-bookmark-fill"
    },
    {
      label: "Sub-Heading",
      icon: "pi pi-bookmark"
    },
    {
      label: "Image",
      icon: "pi pi-image"
    }
  ]

  constructor(protected contentService: ContentService, private router: Router) {
  }

  ngAfterViewInit(): void {
    this.loadElements()
    this.contentService.render(this.id)
  }

  loadElements() {
    this.contentService.loadElements(this.id)
  }

  returnToDashboard() {
    this.router.navigate(['/dash'])
  }

}
