import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { from, mergeMap, Observable } from 'rxjs';
import { CarApiModel } from '../models/car.api.model';
import { carNames } from './car-names';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private rootApiUrl = env.apiUrl;
  private fullUrl = `${this.rootApiUrl}/garage`;
  isRaceOn = false;
  createCarInputValue: string = '';
  updateCarInputValue: string = '';

  constructor(private http: HttpClient) {}

  getAll(page?: number, limit?: number,): Observable<HttpResponse<CarApiModel[]>> {
    let params = new HttpParams();
    if (page) params = params.set('_page', page.toString());
    if (limit) params = params.set('_limit', limit.toString());
    return this.http.get<CarApiModel[]>(this.fullUrl, {
      params,
      observe: 'response',
    });
  }
  getById(id: number): Observable<CarApiModel> {
    return this.http.get<CarApiModel>(`${this.fullUrl}/${id}`);
  }

  create(car: CarApiModel): Observable<CarApiModel> {
    return this.http.post<CarApiModel>(this.fullUrl, car);
  }

  update(id: number, car: CarApiModel): Observable<CarApiModel> {
    return this.http.put<CarApiModel>(`${this.fullUrl}/${id}`, car);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.fullUrl}/${id}`);
  }
  createHundredRandomCars(): Observable<CarApiModel> {
    const randomCars = this.generateRandomCars();
    return from(randomCars).pipe(
      mergeMap((car) => this.http.post<CarApiModel>(this.fullUrl, car)),
    );
  }

  generateRandomCars(): CarApiModel[] {
    const randomCars: CarApiModel[] = [];

    for (let i = 0; i < 100; i++) {
      const car: CarApiModel = {
        name: this.generateCarName(),
        color: this.generateColor(),
      };

      randomCars.push(car);
    }
    return randomCars;
  }
  generateCarName() {
    const randomNumber = Math.floor(Math.random() * carNames.length);
    return carNames[randomNumber];
  }
  generateColor() {
    const red = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    const green = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    const blue = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');

    return `#${red}${green}${blue}`;
  }
}
