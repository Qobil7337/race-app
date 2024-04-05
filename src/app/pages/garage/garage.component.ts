import {Component, OnInit} from '@angular/core';
import {NzColor} from "ng-zorro-antd/color-picker";
import {CarApiModel} from "../../models/car.api.model";
import {CarService} from "../../services/car.service";
import {PaginationService} from "../../services/pagination.service";

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrl: './garage.component.css'
})
export class GarageComponent implements OnInit {
  cars: CarApiModel[] | null = []
  generateButtonIsLoading = false
  selectedCarId: number = 0

  constructor(private carService: CarService,
              public paginationService: PaginationService) {
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

  logColor($event: { color: NzColor; format: string }) {
    console.log($event.color)
  }

  onPageChange(page: number) {
    this.paginationService.currentPage = page;
    this.loadData();
  }

  generateRandomCars() {
    this.generateButtonIsLoading = true
    this.carService.createHundredRandomCars().subscribe(() => this.generateButtonIsLoading= false)
    this.loadData();
  }

  onCarSelected($event: any) {
    this.selectedCarId = $event
  }
}
