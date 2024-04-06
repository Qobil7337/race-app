import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CarApiModel } from '../../models/car.api.model';
import {CarService} from "../../services/car.service";
import anime from 'animejs/lib/anime.es.js';
import {EngineService} from "../../services/engine.service";
import {EngineResponseApiModel} from "../../models/engine-response.api.model";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent {
  @Input() carData!: CarApiModel;
  @Output() selectedCarId: EventEmitter<number> = new EventEmitter<number>()
  @Output() carRemoved: EventEmitter<any> = new EventEmitter<any>()
  driveMode: boolean = false;
  isStartButtonLoading = false
  isStopButtonLoading= false


  constructor(private carService: CarService,
              public engineService: EngineService) {
  }
  onCarSelect(id: number| undefined) {
    this.selectedCarId.emit(id)
  }

  onRemove(id: number) {
    this.carService.delete(id).subscribe(() => this.carRemoved.emit())
  }

  onStartCar(id: number): void {
    this.isStartButtonLoading = true
    this.engineService.startStopEngine(id, 'started').subscribe({
      next: value => {
        const duration = value.distance / value.velocity
        this.switchToDriveModeAndStartAnimation(id, duration)
      },
      error: err => {
        if (err.status === 400) {
          console.error("Bad request:", err.error.message);
        } else if (err.status === 404) {
          console.error("Car not found:", err.error.message);
        } else {
          console.error("An error occurred:", err);
        }
        this.isStartButtonLoading = false;
      },
      complete: () => {}
    })
  }

  onStopCar(id: number) {
    this.isStopButtonLoading = true
    this.engineService.startStopEngine(id, 'stopped').subscribe({
      next: value => {
        this.stopAnimationAndResetPosition(id)
        this.isStopButtonLoading = false
        this.driveMode = false
      },
      error: err => {},
      complete: () => {}
    })
  }

  switchToDriveModeAndStartAnimation(id: number, duration: number): void {
    this.engineService.switchToDriveMode(id).subscribe({
      next: value => {
        if (value.success) {
          this.animate(id, duration);
          this.isStartButtonLoading = false;
          this.driveMode = true;
        }
      },
      error: err => {
        if (err.status === 400) {
          console.error("Bad request:", err.error);
        } else if (err.status === 404) {
          console.error("Car not found:", err.error);
        } else if (err.status === 429) {
          console.error("Too many requests:", err.error);
        } else if (err.status === 500) {
          console.error("Internal server error:", err.error);
        } else {
          console.error("An error occurred:", err);
        }
        this.isStartButtonLoading = false;
      },
      complete: () => {}
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
  stopAnimation(id: number) {
    const carElementSelector = `.car-${id}`;
    anime.remove(carElementSelector); // Stop any ongoing animation
  }
  stopAnimationAndResetPosition(id: number) {
    const carElementSelector = `.car-${id}`;
    anime.remove(carElementSelector); // Stop any ongoing animation
    anime.set(carElementSelector, { translateX: '0' }); // Reset position
  }



}
