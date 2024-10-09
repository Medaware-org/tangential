import {Component, Input} from '@angular/core';
import {ContentService} from "../../service/content.service";

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {

  @Input() id!: string

  constructor(private contentService: ContentService) {
    
  }

}
