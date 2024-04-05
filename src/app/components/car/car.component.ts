import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CarApiModel } from '../../models/car.api.model';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent {
  @Input() carData!: CarApiModel;
  @Output() selectedCarId: EventEmitter<string| undefined | null> = new EventEmitter<string| undefined | null>()

  onCarSelect(id: string | null | undefined) {
    this.selectedCarId.emit(id)
  }
}
