import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {CarService} from "../../services/car.service";
import {CarApiModel} from "../../models/car.api.model";

@Component({
  selector: 'app-update-car-form',
  templateUrl: './update-car-form.component.html',
  styleUrl: './update-car-form.component.css'
})
export class UpdateCarFormComponent {
  @Output() carUpdated: EventEmitter<any> = new EventEmitter<any>()
  @Input() carId: string = ''
  carForm = this.formBuilder.group({
    name: ['', Validators.required],
    color: ['', Validators.required]
  })

  constructor(private formBuilder: FormBuilder,
              private carService: CarService) {}

  onSubmit() {
    const carData: CarApiModel = {
      name: this.carForm.get('name')!.value,
      color: this.carForm.get('color')!.value,
    };
    this.carService.update(+this.carId,carData).subscribe(() => {
      this.carUpdated.emit()
      this.carForm.reset()
    });
  }

}
