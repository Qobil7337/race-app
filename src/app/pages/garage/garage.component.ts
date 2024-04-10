import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {CarApiModel} from "../../models/car.api.model";
import {CarService} from "../../services/car.service";
import {PaginationService} from "../../services/pagination.service";
import {EngineService} from "../../services/engine.service";
import {AlertService} from "../../services/alert.service";
import anime from "animejs/lib/anime.es";
import {WinnersService} from "../../services/winners.service";
import {AnimeParams} from "animejs";
import {PreserveGarageStateService} from "../../services/preserve-garage-state.service";
import {CarPositionService} from "../../services/car-position.service";

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrl: './garage.component.css'
})
export class GarageComponent implements OnInit, OnDestroy, AfterViewInit {
  cars: CarApiModel[] = []
  engineStartedCars: { id: number; name: string, duration: number; }[] = [];
  selectedCarId: number = 0


  constructor(private carService: CarService,
              public paginationService: PaginationService,
              private engineService: EngineService,
              private alertService: AlertService,
              private winnersService: WinnersService,
              public preserveGarageState: PreserveGarageStateService,
              private renderer: Renderer2,
              private elementRef: ElementRef,
              private carPositionService: CarPositionService) {}



  ngOnInit() {
    this.loadData()

  }

  ngAfterViewInit() {
    if (this.carPositionService.getCarPositions().length >= 0) {
      setTimeout( () => {
        const carPositions = this.carPositionService.getCarPositions();
        carPositions.forEach(carPosition => {
          const carElement = this.elementRef.nativeElement.querySelector(`.car-${carPosition.id}`);
          setTimeout(() => {console.log(carElement)},2000)
          if (carElement) {
            this.renderer.setStyle(carElement, 'position', 'absolute');
            this.renderer.setStyle(carElement, 'left', carPosition.left);
            this.renderer.setStyle(carElement, 'top', carPosition.top);
          }
        });
        console.log(carPositions)
      },100)
    }
  }


  ngOnDestroy() {
    setTimeout(() => {
      const carPositions: { id: number; left: string; top: string; }[] = [];
      this.cars.forEach(car => {
        const carElement = this.elementRef.nativeElement.querySelector(`.car-${car.id}`);
        console.log(carElement)
        if (carElement) {

          const { left, top } = carElement.getBoundingClientRect();
          console.log(`Position of car ${car.id}: Left - ${left}px, Top - ${top}px`);
          // Store or use the position as needed
        } else {
          console.warn(`Car element with selector ${carElement} not found.`);
        }

      });
      // this.carPositionService.setCarPositions(carPositions);
    }, 2000); // Adjust the delay as needed
  }

  loadData() {
    this.carService.getAll(this.paginationService.currentGaragePage, this.paginationService.carRecordsPerPage)
      .subscribe(response => {
        this.cars = response.body || [];
        const totalNumberOfRecords = response.headers?.get('X-Total-Count');
        this.paginationService.totalNumberOfCarRecords = totalNumberOfRecords ? +totalNumberOfRecords : 0;
      });
  }

  onPageChange(page: number) {
    this.paginationService.currentGaragePage = page;
    this.loadData();
  }

  generateRandomCars() {
    this.preserveGarageState.isGenerateButtonLoading = true
    this.carService.createHundredRandomCars().subscribe(() => this.preserveGarageState.isGenerateButtonLoading = false)
    this.loadData();
  }

  onCarSelected($event: any) {
    this.selectedCarId = $event
  }

  race() {
    this.preserveGarageState.isRaceButtonLoading = true;
    const promises: Promise<void>[] = this.cars.map(car => {
      return new Promise<void>((resolve) => {
        this.engineService.startStopEngine(car.id!, 'started').subscribe({
          next: value => {
            const duration = value.distance / value.velocity
            const engineStartedCar = {id: car.id!, name: car.name,duration: duration}
            this.engineStartedCars.push(engineStartedCar)
            resolve()
          },
          error: err => {
            this.handleStartEngineError(car.name, err);
            resolve();
          },
        });
      });
    });

    Promise.all(promises).then(() => {
      this.preserveGarageState.isRaceButtonLoading = false;
      this.animate(this.engineStartedCars)
      this.turnDriveModeOn()
      this.carService.isRaceOn = true
      this.preserveGarageState.raceInProgress = true
      setTimeout(() => this.displayWinner(),7000)
    });
  }

  displayWinner() {
    const durations = this.engineStartedCars.map(car => car.duration)
    const minDuration = Math.min(...durations)
    const winner = this.engineStartedCars.find(car => car.duration === minDuration)
    this.alertService.success(`Winner: ${winner?.name}. Time: ${(minDuration / 1000).toFixed(2)}s`)
    // first i need to check if id id present in winners table
    this.winnersService.getAllWinners().subscribe({
      next: value => {
        const isCurrentWinnerInWinnersTable = value.body!.find(value => value.id === winner?.id)
        if (isCurrentWinnerInWinnersTable) {
          this.winnersService.updateWinner(isCurrentWinnerInWinnersTable.id, {wins: isCurrentWinnerInWinnersTable.wins + 1, time: Number((minDuration / 1000).toFixed(2))}).subscribe()
        } else {
          this.winnersService.createWinner({id: winner?.id || 0, time: Number((minDuration / 1000).toFixed(2)), wins: 1}).subscribe()
        }
      },
      error: err => {}
    })
  }

  animate(engineStartedCars: {id: number, name: string, duration: number}[]) {
    engineStartedCars.forEach(car => {
      const carElementSelector = `.car-${car.id}`;
      const viewportWidth = `${window.innerWidth - 300}px`;
      const animationProperties = {
        targets: carElementSelector,
        translateX: viewportWidth,
        duration: car.duration,
        easing: 'linear',
      }
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

  handleDriveModeError(id: number, carName: string, err: any) {
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
      this.stopAnimation(id)
      this.engineStartedCars = this.engineStartedCars.filter(car => car.id !== id);
      console.error("Internal server error:", err.error);
    } else {
      this.alertService.error(`${err.error}`)
      console.error("An error occurred:", err);
    }
  }

  reset() {
    this.preserveGarageState.isResetButtonLoading = true
    const promises: Promise<void>[] = this.engineStartedCars.map(car => {
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
      this.preserveGarageState.raceInProgress = false
      this.preserveGarageState.isResetButtonLoading = false
      this.cars.forEach(car => {
        this.stopAnimationAndResetPosition(car.id!)
      })
      this.carService.isRaceOn = false
      this.engineStartedCars = []
    })
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

  turnDriveModeOn() {
    this.engineStartedCars.forEach(car => {
      this.engineService.switchToDriveMode(car.id).subscribe({
        next: value => {
          if (value.success) {
            return
          }
        },
        error: err => {
          this.handleDriveModeError(car.id, car.name, err)
        }
      })
    })
  }

}

