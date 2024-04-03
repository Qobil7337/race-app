import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  currentPage = 1;
  recordsPerPage = 7;
  totalNumberOfRecords = 0;

  constructor() { }
}
