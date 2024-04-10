import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CarService} from "../../services/car.service";
import {CarApiModel} from "../../models/car.api.model";

@Component({
  selector: 'app-create-car-form',
  templateUrl: './create-car-form.component.html',
  styleUrl: './create-car-form.component.css'
})
export class CreateCarFormComponent implements OnInit, OnDestroy {
  @Output() carCreated: EventEmitter<void> = new EventEmitter<void>();
  carForm!: FormGroup
  inputValue: string = ''

  constructor(private formBuilder: FormBuilder,
              private carService: CarService,) {}

  ngOnInit() {
    this.inputValue = this.carService.createCarInputValue
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

  assignInputValueOnChange($event: Event) {
    const inputElement = event!.target as HTMLInputElement;
    this.inputValue = inputElement.value;
  }

  ngOnDestroy() {
    this.carService.createCarInputValue = this.inputValue
  }
}
