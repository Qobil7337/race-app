import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CarService} from "../../services/car.service";
import {CarApiModel} from "../../models/car.api.model";

@Component({
  selector: 'app-create-car-form',
  templateUrl: './create-car-form.component.html',
  styleUrl: './create-car-form.component.css'
})
export class CreateCarFormComponent implements OnInit {
  @Output() carCreated: EventEmitter<void> = new EventEmitter<void>();
  carForm!: FormGroup

  constructor(private formBuilder: FormBuilder,
              private carService: CarService) {}

  ngOnInit() {
    this.carForm = this.formBuilder.group({
      name: ['', Validators.required],
      color: ['', Validators.required]
    })
  }

  onSubmit() {
    const carData: CarApiModel = {
      name: this.carForm.value.name,
      color: this.carForm.value.color,
    };
    this.carService.create(carData).subscribe(() => {
      this.carCreated.emit()
      this.carForm.reset()
    });
  }
}
