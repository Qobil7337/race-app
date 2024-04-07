import {Component, OnInit} from '@angular/core';
import {CarApiModel} from "../../models/car.api.model";
import {CarService} from "../../services/car.service";
import {PaginationService} from "../../services/pagination.service";
import {EngineService} from "../../services/engine.service";
import {AlertService} from "../../services/alert.service";
import anime from "animejs/lib/anime.es";

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrl: './garage.component.css'
})
export class GarageComponent implements OnInit {
  cars: CarApiModel[] = []
  driveModeOnCars: { id: number; duration: number; }[] = [];
  isGenerateButtonLoading = false
  selectedCarId: number = 0
  isRaceButtonLoading = false
  isResetButtonLoading = false
  raceInProgress = false

  constructor(private carService: CarService,
              public paginationService: PaginationService,
              private engineService: EngineService,
              private alertService: AlertService) {
  }
  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.carService.getAll(this.paginationService.currentPage, this.paginationService.recordsPerPage)
      .subscribe(response => {
        this.cars = response.body || [];
        const totalNumberOfRecords = response.headers?.get('X-Total-Count');
        this.paginationService.totalNumberOfRecords = totalNumberOfRecords ? +totalNumberOfRecords : 0;
      });
  }

  onPageChange(page: number) {
    this.paginationService.currentPage = page;
    this.loadData();
  }

  generateRandomCars() {
    this.isGenerateButtonLoading = true
    this.carService.createHundredRandomCars().subscribe(() => this.isGenerateButtonLoading= false)
    this.loadData();
  }

  onCarSelected($event: any) {
    this.selectedCarId = $event
  }

  race() {
    this.isRaceButtonLoading = true;
    const promises: Promise<void>[] = this.cars.map(car => {
      return new Promise<void>((resolve) => {
        this.engineService.startStopEngine(car.id!, 'started').subscribe({
          next: value => {
            const duration = value.distance / value.velocity
            this.engineService.switchToDriveMode(car.id!).subscribe({
              next: value1 => {
                if (value1.success) {
                  const successCars = {
                    id: car.id!,
                    duration: duration
                  }
                  this.driveModeOnCars.push(successCars)
                }
                resolve();
              },
              error: err => {
                this.handleDriveModeError(car.name, err);
                resolve();
              },
            })
          },
          error: err => {
            this.handleStartEngineError(car.name, err);
            resolve();
          },
        });
      });
    });

    Promise.all(promises).then(() => {
      this.isRaceButtonLoading = false;
      this.animate(this.driveModeOnCars)
      this.raceInProgress = true
    });
  }

  animate(driveModeOnCars: {id: number, duration: number}[]) {
    driveModeOnCars.forEach(car => {
      const carElementSelector = `.car-${car.id}`;
      const viewportWidth = `${window.innerWidth - 300}px`;
      const animationProperties = {
        targets: carElementSelector,
        translateX: viewportWidth,
        duration: car.duration,
        easing: 'linear',
      };
      anime(animationProperties);
    })
  }

  handleStartEngineError(carName: string, err: any) {
    if (err.status === 400) {
      this.alertService.error(`Error occurred with car ${carName}, ${err.error}`)
      console.error("Bad request:", err.error.message);
    } else if (err.status === 404) {
      this.alertService.error(`Error occurred with car ${carName}, ${err.error}`)
      console.error("Car not found:", err.error.message);
    } else {
      this.alertService.error(`Error occurred with car ${carName}, ${err.error}`)
      console.error("An error occurred:", err);
    }
  }

  handleDriveModeError(carName: string, err: any) {
    if (err.status === 400) {
      this.alertService.error(`Error occurred with car ${carName}, ${err.error}`)
      console.error("Bad request:", err.error);
    } else if (err.status === 404) {
      this.alertService.error(`Error occurred with car ${carName}, ${err.error}`)
      console.error("Car not found:", err.error);
    } else if (err.status === 429) {
      this.alertService.error(`Error occurred with car ${carName}, ${err.error}`)
      console.error("Too many requests:", err.error);
    } else if (err.status === 500) {
      this.alertService.error(`Error occurred with car ${carName}, ${err.error}`)
      console.error("Internal server error:", err.error);
    } else {
      this.alertService.error(`${err.error}`)
      console.error("An error occurred:", err);
    }
  }

  reset() {
    this.isResetButtonLoading = true
    const promises: Promise<void>[] = this.driveModeOnCars.map(car => {
      return new Promise<void>((resolve) => {
        this.engineService.startStopEngine(car.id, 'stopped').subscribe({
          next: value => {
            resolve()
          },
          error: err => {
            this.alertService.error(err.error)
            resolve()
          }
        })
      })
    })
    Promise.all(promises).then(() => {
      this.raceInProgress = false
      this.isResetButtonLoading = false
      this.driveModeOnCars.forEach(car => {
        this.stopAnimationAndResetPosition(car.id)
      })
      this.driveModeOnCars = []
    })
  }

  stopAnimationAndResetPosition(id: number) {
    const carElementSelector = `.car-${id}`;
    anime.remove(carElementSelector); // Stop any ongoing animation
    anime.set(carElementSelector, { translateX: '0' }); // Reset position
  }

  }

