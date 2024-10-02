import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {LoginComponent} from "./login/login.component";
import {CardModule} from "primeng/card";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";
import {TabViewModule} from "primeng/tabview";
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {LoginService} from "../service/login.service";

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    LoginComponent,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    Button,
    TabViewModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent implements AfterViewInit {

  @ViewChild("backgroundCanvas") canvas!: ElementRef<HTMLCanvasElement>

  protected loading: boolean = false

  private context: CanvasRenderingContext2D | undefined
  private canvasElement: HTMLCanvasElement | undefined

  private lastTime: number = 0
  private phaseCounter: number = 0

  private signatureColor = "rgba(240, 240, 240, 0.2)"

  constructor(protected loginService: LoginService) {
  }

  private fitCanvas() {
    this.canvasElement!.width = window.innerWidth + 5
    this.canvasElement!.height = window.innerHeight
  }

  private renderSine(style: string, phaseOffset: number, amplitude: number, freq: number, yOffset: number = 0) {
    if (!this.context || !this.canvasElement)
      return

    this.context.fillStyle = style
    this.context.beginPath()

    for (let x = 0; x < window.innerWidth; x ++) {
      let sineValue = Math.sin((2 * Math.PI * freq) * ((x + phaseOffset) / 2000)) * amplitude
      this.context.lineTo(x, window.innerHeight - 2 * amplitude - sineValue + yOffset)
    }

    this.context.lineTo(this.canvasElement.width + 20, window.innerHeight + 20)
    this.context.lineTo(this.canvasElement.offsetLeft - 20, window.innerHeight + 20)

    this.context.closePath()
    this.context.fill()
  }

  private renderBackgroundFrame(time: number) {
    if (!this.context || !this.canvasElement)
      return

    let timeDelta = time - this.lastTime
    this.lastTime = time

    this.phaseCounter += timeDelta / 5000.0

    this.fitCanvas()

    // And now the sine waves
    this.renderSine(this.signatureColor, (window.innerWidth / 2) * Math.cos(this.phaseCounter), window.innerHeight / 5, 1.0)
    this.renderSine(this.signatureColor, -300 * Math.cos(this.phaseCounter) + 200, 100.0, 2.5 + Math.sin(this.phaseCounter / 2.0) * 0.5)
    this.renderSine(this.signatureColor, -200.0 * Math.sin(this.phaseCounter), 170.0, 2 + Math.cos(this.phaseCounter / 3.0) * 0.5, -50)
    this.renderSine(this.signatureColor, -400.0 * Math.cos(this.phaseCounter), 150.0, 2.5 + Math.sin(this.phaseCounter) * 0.5)

    requestAnimationFrame((t) => {
      this.renderBackgroundFrame(t)
    })
  }

  ngAfterViewInit(): void {
    this.canvasElement = this.canvas.nativeElement

    this.fitCanvas()

    let context = this.canvasElement.getContext('2d')

    if (!context)
      return

    this.context = context

    requestAnimationFrame((t) => {
      this.renderBackgroundFrame(t)
    })
  }

}
