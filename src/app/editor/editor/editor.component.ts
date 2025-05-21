import {AfterViewInit, Component, Input, signal, WritableSignal} from '@angular/core';
import {ContentService} from "../../service/content.service";
import {Button} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {Router} from "@angular/router";
import {SplitButtonModule} from "primeng/splitbutton";
import {SplitterModule} from "primeng/splitter";
import {TabViewModule} from "primeng/tabview";
import {Ripple} from "primeng/ripple";
import {ConfirmationService, MenuItem} from "primeng/api";
import {MenubarModule} from "primeng/menubar";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ElementTypeRequirement, TangentialAuxiliaryService} from "../../openapi";
import {FeedbackService} from "../../service/feedback.service";
import {FloatLabelModule} from "primeng/floatlabel";
import {NgIf, TitleCasePipe} from "@angular/common";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    Button,
    TooltipModule,
    SplitButtonModule,
    SplitterModule,
    TabViewModule,
    MenubarModule,
    DialogModule,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    FloatLabelModule,
    ConfirmDialogModule,
    NgIf,
    ProgressSpinnerModule
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit {

  @Input() private id!: string

  toolbarItems: MenuItem[] = [
    {
      label: "Heading",
      icon: "pi pi-bookmark-fill",
      command: () => this.openNewElementDialog("HEADING")
    },
    {
      label: "Sub-Heading",
      icon: "pi pi-bookmark",
      command: () => this.openNewElementDialog("SUBHEADING")
    },
    {
      label: "Image",
      icon: "pi pi-image",
      command: () => this.openNewElementDialog("IMAGE")
    },
    {
      label: "Text",
      icon: "pi pi-align-left",
      command: () => this.openNewElementDialog("TEXT")
    }
  ]

  protected newElementFormGroup = new FormGroup({
    handle: new FormControl('', [Validators.required]),
    elementType: new FormControl<ElementTypeRequirement | undefined>(undefined, [Validators.required])
  })

  protected editTitleFormGroup = new FormGroup({
    title: new FormControl('', [Validators.required])
  })

  protected newElementDialogVisible = signal(false)

  protected editTitleDialogVisible = signal(false)

  protected elementTypes: WritableSignal<ElementTypeRequirement[]> = signal([])

  protected valueConstraints: WritableSignal<Map<string, string[]>> = signal(new Map<string, string[]>())

  constructor(protected contentService: ContentService, protected auxService: TangentialAuxiliaryService, private feedbackService: FeedbackService, private router: Router, private confirmationService: ConfirmationService) {
  }

  ngAfterViewInit(): void {
    this.contentService.selectArticleInitRef(this.id, () => {
      this.loadValueConstraints()
      this.loadElementTypes()
      this.loadElements()
      this.contentService.render()
    })
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
    this.contentService.loadElements()
  }

  openNewElementDialog(type: string = "BLANK_PLACEHOLDER") {
    this.newElementFormGroup.reset()
    this.newElementFormGroup.patchValue({
      elementType: this.elementTypes().find((v: ElementTypeRequirement) => v.type == type)
    })
    this.newElementDialogVisible.set(true)
  }

  createNewElement() {
    this.newElementDialogVisible.set(false)

    if (this.newElementFormGroup.invalid)
      return

    this.contentService.createElement(this.newElementFormGroup.get('handle')?.value!, this.newElementFormGroup.get('elementType')?.value!.type!)
  }

  loadValueConstraints() {
    this.auxService.getMetaEntryValueConstraints().subscribe({
      next: resp => {
        let constraints = new Map<string, string[]>()
        resp.forEach((element) => {
          constraints.set(element.key!, element.constraints!)
        })
        this.valueConstraints.set(constraints)
      },
      error: err => {
        this.feedbackService.catalystError(err)
      }
    })
  }

  constraintsOf(metaEntry: string): string[] {
    return this.valueConstraints().get(metaEntry) || []
  }

  commitMetaChange(elementId: string, key: string, newValue: string) {
    if (key == "ELEMENT_TYPE") {
      this.commitTypeChange(elementId, newValue)
      return
    }

    this.contentService.putMeta(elementId, key, newValue)
  }

  private commitTypeChange(id: string, newType: string) {
    this.confirmationService.confirm({
      header: `Commit type change?`,
      message: `Are you sure that you want to change the type of this element? This is irreversible, and will overwrite some existing meta fields.`,
      accept: () => {
        this.contentService.changeElementType(id, newType)
      }
    })
  }

  initTitleEdit() {
    this.editTitleFormGroup.reset({
      title: this.contentService.selectedArticleRef()?.title!
    })
    this.editTitleDialogVisible.set(true)
  }

  renameArticle() {
    this.editTitleDialogVisible.set(false)
    this.contentService.renameArticle(this.editTitleFormGroup.get('title')!.value!, () => {
      this.contentService.reloadArticleData()
    })
  }

}
