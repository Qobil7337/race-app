import {Component, Input} from '@angular/core';
import { CarApiModel } from '../../models/car.api.model';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent {
  @Input() carData!: CarApiModel;

}
