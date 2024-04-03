import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import { GarageComponent } from './pages/garage/garage.component';
import { WinnersComponent } from './pages/winners/winners.component';
import {NzColorPickerComponent} from "ng-zorro-antd/color-picker";
import { CarComponent } from './components/car/car.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NzButtonComponent} from "ng-zorro-antd/button";
import { CreateCarFormComponent } from './components/create-car-form/create-car-form.component';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, GarageComponent, WinnersComponent, CarComponent, CreateCarFormComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, NzPaginationComponent, NzColorPickerComponent, FontAwesomeModule, NzButtonComponent, ReactiveFormsModule],
  providers: [provideHttpClient(), { provide: NZ_I18N, useValue: en_US }, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
