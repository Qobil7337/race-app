import { Injectable } from '@angular/core';
import {environment as env} from "../../environments/environment";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {CarApiModel} from "../models/car.api.model";

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private rootApiUrl = env.apiUrl
  private fullUrl = `${this.rootApiUrl}/garage`

  constructor(private http: HttpClient) { }

  getAll(page?: number, limit?: number): Observable<HttpResponse<CarApiModel[]>> {
    let params = new HttpParams()
    if (page) params = params.set('_page', page.toString())
    if (limit) params = params.set('_limit', limit.toString())
     return this.http.get<CarApiModel[]>(this.fullUrl, {params, observe: 'response'})
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
}
