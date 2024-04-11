import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreserveGarageStateService {
  isGenerateButtonLoading = false;
  isRaceButtonLoading = false;
  isResetButtonLoading = false;
  raceInProgress = false;
  constructor() {}
}
