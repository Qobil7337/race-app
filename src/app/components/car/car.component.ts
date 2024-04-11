import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarApiModel } from '../../models/car.api.model';
import { CarService } from '../../services/car.service';
import anime from 'animejs/lib/anime.es.js';
import { EngineService } from '../../services/engine.service';
import { AlertService } from '../../services/alert.service';
import {WinnersService} from "../../services/winners.service";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrl: './car.component.css',
})
export class CarComponent {
  @Input() carData!: CarApiModel;
  @Output() selectedCarId: EventEmitter<number> = new EventEmitter<number>();
  @Output() carRemoved: EventEmitter<any> = new EventEmitter<any>();
  driveMode: boolean = false;
  isStartButtonLoading = false;
  isStopButtonLoading = false;

  constructor(
    public carService: CarService,
    public engineService: EngineService,
    private alertService: AlertService,
    private winnersService: WinnersService,
  ) {}
  onCarSelect(id: number | undefined) {
    this.selectedCarId.emit(id);
  }

  onRemove(id: number) {
    this.carService.delete(id).subscribe(() => this.carRemoved.emit());
    this.winnersService.deleteWinner(id).subscribe()
  }

  onStartCar(id: number, name: string): void {
    this.isStartButtonLoading = true;
    this.engineService.startStopEngine(id, 'started').subscribe({
      next: (value) => {
        this.isStartButtonLoading = false;
        this.driveMode = true;
        const duration = value.distance / value.velocity;
        this.animate(id, duration);
        this.switchToDriveMode(id, name);
      },
      error: (err) => {
        if (err.status === 400) {
          this.alertService.error(
            `Error occurred with car ${name}, ${err.error}`,
          );
          console.error('Bad request:', err.error.message);
        } else if (err.status === 404) {
          this.alertService.error(
            `Error occurred with car ${name}, ${err.error}`,
          );
          console.error('Car not found:', err.error.message);
        } else {
          this.alertService.error(
            `Error occurred with car ${name}, ${err.error}`,
          );
          console.error('An error occurred:', err);
        }
        this.isStartButtonLoading = false;
      },
      complete: () => {},
    });
  }

  onStopCar(id: number) {
    this.isStopButtonLoading = true;
    this.engineService.startStopEngine(id, 'stopped').subscribe({
      next: (value) => {
        this.stopAnimationAndResetPosition(id);
        this.isStopButtonLoading = false;
        this.driveMode = false;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  switchToDriveMode(id: number, name: string): void {
    this.engineService.switchToDriveMode(id).subscribe({
      next: (value) => {
        if (value.success) {
          return;
        }
      },
      error: (err) => {
        if (err.status === 400) {
          this.alertService.error(
            `Error occurred with car ${name}, ${err.error}`,
          );
          console.error('Bad request:', err.error);
        } else if (err.status === 404) {
          this.alertService.error(
            `Error occurred with car ${name}, ${err.error}`,
          );
          console.error('Car not found:', err.error);
        } else if (err.status === 429) {
          this.alertService.error(
            `Error occurred with car ${name}, ${err.error}`,
          );
          console.error('Too many requests:', err.error);
        } else if (err.status === 500) {
          this.alertService.error(
            `Error occurred with car ${name}, ${err.error}`,
          );
          this.stopAnimation(id);
          console.error('Internal server error:', err.error);
        } else {
          this.alertService.error(`${err.error}`);
          console.error('An error occurred:', err);
        }
        this.isStartButtonLoading = false;
      },
      complete: () => {},
    });
  }

  animate(id: number, duration: number) {
    const carElementSelector = `.car-${id}`;
    const viewportWidth = `${window.innerWidth - 300}px`;
    const animationProperties = {
      targets: carElementSelector,
      translateX: viewportWidth,
      duration: duration,
      easing: 'linear',
    };
    anime(animationProperties);
  }
  stopAnimationAndResetPosition(id: number) {
    const carElementSelector = `.car-${id}`;
    anime.remove(carElementSelector); // Stop any ongoing animation
    anime.set(carElementSelector, { translateX: '0' }); // Reset position
  }
  stopAnimation(id: number) {
    const carElementSelector = `.car-${id}`;
    anime.remove(carElementSelector); // Stop any ongoing animation
  }
}
