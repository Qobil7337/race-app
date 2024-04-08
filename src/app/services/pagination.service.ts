import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  currentGaragePage = 1;
  currentWinnersPage = 1;
  recordsPerPage = 7;
  totalNumberOfWinnersRecords = 0
  totalNumberOfCarRecords = 0;

  constructor() { }
}
