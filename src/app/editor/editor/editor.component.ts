import {AfterViewInit, Component, Input, signal, WritableSignal} from '@angular/core';
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
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ElementTypeRequirement, TangentialAuxiliaryService} from "../../openapi";
import {FeedbackService} from "../../service/feedback.service";
import {FloatLabelModule} from "primeng/floatlabel";

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
    MenubarModule,
    DialogModule,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    FloatLabelModule
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

  protected newElementFormGroup = new FormGroup({
    handle: new FormControl('', [Validators.required]),
    elementType: new FormControl<ElementTypeRequirement | undefined>(undefined, [Validators.required])
  })

  protected newElementDialogVisible = signal(false)

  protected elementTypes: WritableSignal<ElementTypeRequirement[]> = signal([])

  constructor(protected contentService: ContentService, protected auxService: TangentialAuxiliaryService, private feedbackService: FeedbackService, private router: Router) {
  }

  ngAfterViewInit(): void {
    this.loadElementTypes()
    this.loadElements()
    this.contentService.render(this.id)
  }

  loadElementTypes() {
    this.auxService.getElementTypes().subscribe({
      next: response => {
        this.elementTypes.set(response)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.router.navigate(['/dash/overview'])
      }
    })
  }

  loadElements() {
    this.contentService.loadElements(this.id)
  }

  openNewElementDialog() {
    this.newElementFormGroup.reset()
    this.newElementFormGroup.patchValue({
      elementType: (this.elementTypes())[0]
    })
    this.newElementDialogVisible.set(true)
  }

  returnToDashboard() {
    this.router.navigate(['/dash'])
  }

  createNewElement() {
    this.newElementDialogVisible.set(false)

    if (this.newElementFormGroup.invalid)
      return

    this.contentService.createElement(this.id, this.newElementFormGroup.get('handle')?.value!, this.newElementFormGroup.get('elementType')?.value!.type!)
  }

}
