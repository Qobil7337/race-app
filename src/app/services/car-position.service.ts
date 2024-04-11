import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarPositionService {
  private carPositions: { id: number; left: string; top: string }[] = [];
  constructor() {}

  getCarPositions(): { id: number; left: string; top: string }[] {
    return this.carPositions;
  }

  setCarPositions(
    positions: { id: number; left: string; top: string }[],
  ): void {
    this.carPositions = positions;
  }
}
