import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {WinnerApiModel} from "../models/winner.api.model";
import {environment as env} from "../../environments/environment";
import {CarApiModel} from "../models/car.api.model";

@Injectable({
  providedIn: 'root'
})
export class WinnersService {
  private rootApiUrl = env.apiUrl
  private fullUrl = `${this.rootApiUrl}/winners`

  constructor(private http: HttpClient) { }

  getAllWinners(page?: number, limit?: number, sort?: string, order?: 'ASC' | 'DESC'): Observable<HttpResponse<WinnerApiModel[]>> {
    let params = new HttpParams();
    if (page) params = params.set('_page', page.toString());
    if (limit) params = params.set('_limit', limit.toString());
    if (sort) params = params.set('_sort', sort);
    if (order) params = params.set('_order', order);

    return this.http.get<WinnerApiModel[]>(this.fullUrl, { params, observe: 'response' });
  }

  getWinnerById(id: number): Observable<WinnerApiModel> {
    return this.http.get<WinnerApiModel>(`${this.fullUrl}/${id}`);
  }

  createWinner(winner: WinnerApiModel): Observable<WinnerApiModel> {
    return this.http.post<WinnerApiModel>(this.fullUrl, winner);
  }

  updateWinner(id: number, winner: Partial<WinnerApiModel>): Observable<WinnerApiModel> {
    return this.http.put<WinnerApiModel>(`${this.fullUrl}/${id}`, winner);
  }

  deleteWinner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.fullUrl}/${id}`);
  }
}
