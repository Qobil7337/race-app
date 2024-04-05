import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CarService} from "../../services/car.service";
import {CarApiModel} from "../../models/car.api.model";

@Component({
  selector: 'app-update-car-form',
  templateUrl: './update-car-form.component.html',
  styleUrl: './update-car-form.component.css'
})
export class UpdateCarFormComponent implements OnInit {
  @Output() carUpdated: EventEmitter<any> = new EventEmitter<any>()
  @Input() carId: number = 0
  carForm!: FormGroup

  ngOnInit() {
    this.carForm = this.formBuilder.group({
      name: ['', Validators.required],
      color: ['', Validators.required]
    })
  }

  constructor(private formBuilder: FormBuilder,
              private carService: CarService) {}

  onSubmit() {
    const carData: CarApiModel = {
      name: this.carForm.value.name,
      color: this.carForm.value.color,
    };
    this.carService.update(this.carId,carData).subscribe(() => {
      this.carUpdated.emit()
      this.carForm.reset()
    });
  }

}
