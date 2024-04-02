import { Component } from '@angular/core';
import {CarService} from "./services/car.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'async-race-app';
  constructor() {
  }

}
