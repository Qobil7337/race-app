import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {CarService} from "../../services/car.service";
import {CarApiModel} from "../../models/car.api.model";

@Component({
  selector: 'app-create-car-form',
  templateUrl: './create-car-form.component.html',
  styleUrl: './create-car-form.component.css'
})
export class CreateCarFormComponent {
  @Output() carCreated: EventEmitter<void> = new EventEmitter<void>();
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
    this.carService.create(carData).subscribe(() => {
      this.carCreated.emit()
      this.carForm.reset()
    });
  }
}
