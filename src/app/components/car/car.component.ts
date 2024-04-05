import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CarApiModel } from '../../models/car.api.model';
import {CarService} from "../../services/car.service";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent {
  @Input() carData!: CarApiModel;
  @Output() selectedCarId: EventEmitter<number> = new EventEmitter<number>()
  @Output() carRemoved: EventEmitter<any> = new EventEmitter<any>()
  constructor(private carService: CarService) {
  }
  onCarSelect(id: number| undefined) {
    this.selectedCarId.emit(id)
  }

  onRemove(id: number) {
    this.carService.delete(id).subscribe(() => this.carRemoved.emit())
  }
}
