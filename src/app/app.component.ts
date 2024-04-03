import {Component, OnInit} from '@angular/core';
import {CarService} from "./services/car.service";
import {EngineService} from "./services/engine.service";
import {CarApiModel} from "./models/car.api.model";
import {PaginationService} from "./services/pagination.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  cars: CarApiModel[] | null= []
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
    console.log(page)
    this.loadData();
  }

  title = 'async-race-app';
  constructor(private engineService: EngineService,
              private carService: CarService,
              public paginationService: PaginationService) {
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
  generateRandomCars() {
    this.carService.createHundredRandomCars().subscribe()
  }
  getAllCars() {
    this.carService.getAll().subscribe(data => console.log(data))
  }
}
