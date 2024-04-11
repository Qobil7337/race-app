import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  currentGaragePage = 1;
  currentWinnersPage = 1;
  carRecordsPerPage = 7;
  winnerRecordsPerPage = 10;
  totalNumberOfWinnersRecords = 0;
  totalNumberOfCarRecords = 0;

  constructor() {}
}
