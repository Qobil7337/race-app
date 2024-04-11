import { Component, OnInit } from '@angular/core';
import { CarService } from '../../services/car.service';
import { WinnersService } from '../../services/winners.service';
import { CarApiModel } from '../../models/car.api.model';
import { WinnerApiModel } from '../../models/winner.api.model';
import { WinnerWithCarDetailsApiModel } from '../../models/winner-with-car-details.api.model';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrl: './winners.component.css',
})
export class WinnersComponent implements OnInit {
  cars: CarApiModel[] = [];
  winners: WinnerApiModel[] = [];
  winnersWithCarDetails: WinnerWithCarDetailsApiModel[] = [];
  sortWins: boolean = false
  sortTime: boolean = false

  // I don't have any relation of cars and winners. That is why I need to
  // get cars and winners and compare id's so that i have cars details
  constructor(
    private carService: CarService,
    private winnersService: WinnersService,
    public paginationService: PaginationService,
  ) {}
  ngOnInit() {
    this.loadData();
  }

  onPageChange(page: number) {
    this.paginationService.currentWinnersPage = page;
    this.winnersWithCarDetails = []
    this.loadData();
  }

  loadData() {
    const promises: Promise<void>[] = [];
    const carServicePromise = new Promise<void>((resolve) => {
      this.carService.getAll().subscribe((response) => {
        this.cars = response.body!;
        resolve();
      });
    });
    promises.push(carServicePromise);

    const winnersServicePromise = new Promise<void>((resolve) => {
      this.winnersService
        .getAllWinners(this.paginationService.currentWinnersPage, this.paginationService.winnerRecordsPerPage)
        .subscribe((response) => {
          const totalNumberOfRecords = response.headers?.get('X-Total-Count');
          this.paginationService.totalNumberOfWinnersRecords =
            totalNumberOfRecords ? +totalNumberOfRecords : 0;
          this.winners = response.body!;
          resolve();
        });
    });
    promises.push(winnersServicePromise);

    Promise.all(promises).then(() => {
      this.assignCarDetailsToWinners()
    });
  }
  assignCarDetailsToWinners() {
    this.winners.forEach(winner => {
      const car = this.cars.find(car => car.id === winner.id)
      if (car) {
        const winnerWithCarDetail = {
          id: winner.id,
          name: car.name,
          color: car.color,
          wins: winner.wins,
          time: winner.time,
        }
        this.winnersWithCarDetails.push(winnerWithCarDetail)
      }
    })
  }

  sortByWins() {
    if (this.sortWins) {
      this.sortWins = false
      this.winnersService.getAllWinners(
        this.paginationService.currentWinnersPage,
        this.paginationService.winnerRecordsPerPage,
        'wins',
        'ASC'
      ).subscribe({
        next: value => {
          this.winners = []
          this.winnersWithCarDetails = []
          this.winners = value.body!
          this.assignCarDetailsToWinners()
        },
        error: err => {}
      })
    } else {
      this.sortWins = true
      this.winnersService.getAllWinners(
        this.paginationService.currentWinnersPage,
        this.paginationService.winnerRecordsPerPage,
        'wins',
        'DESC'
      ).subscribe({
        next: value => {
          this.winners = []
          this.winnersWithCarDetails = []
          this.winners = value.body!
          this.assignCarDetailsToWinners()
        },
        error: err => {}
      })
    }

  }

  sortByTime() {
    if (this.sortTime) {
      this.sortTime = false
      this.winnersService.getAllWinners(
        this.paginationService.currentWinnersPage,
        this.paginationService.winnerRecordsPerPage,
        'time',
        "ASC"
      ).subscribe({
        next: value => {
          this.winners = []
          this.winnersWithCarDetails = []
          this.winners = value.body!
          this.assignCarDetailsToWinners()
        },
        error: err => {}
      })
    } else {
      this.sortTime = true
      this.winnersService.getAllWinners(
        this.paginationService.currentWinnersPage,
        this.paginationService.winnerRecordsPerPage,
        'time',
        'DESC'
      ).subscribe({
        next: value => {
          this.winners = []
          this.winnersWithCarDetails = []
          this.winners = value.body!
          this.assignCarDetailsToWinners()
        },
        error: err => {}
      })
    }

  }
}
