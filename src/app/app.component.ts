import { Component } from '@angular/core';
import {CarService} from "./services/car.service";
import {EngineService} from "./services/engine.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'async-race-app';
  constructor(private engineService: EngineService) {
  }

  startEngine(id: number): void {
    this.engineService.startStopEngine(id, 'started').subscribe({
      next: (response) => {
        console.log('Engine started:', response);
      },
      error: (error) => {
        console.error('Failed to start engine:', error);
      }
    });
  }

  stopEngine(id: number): void {
    this.engineService.startStopEngine(id, 'stopped').subscribe({
      next: (response) => {
        console.log('Engine stopped:', response);
      },
      error: (error) => {
        console.error('Failed to stop engine:', error);
      }
    });
  }

  switchToDriveMode(id: number): void {
    this.engineService.switchToDriveMode(id).subscribe({
      next: (response) => {
        console.log('Switched to drive mode:', response);
      },
      error: (error) => {
        console.error('Failed to switch to drive mode:', error);
      }
    });
  }
}
