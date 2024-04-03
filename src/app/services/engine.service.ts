import { Injectable } from '@angular/core';
import {environment as env} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {EngineResponseApiModel} from "../models/engine-response.api.model";

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private rootApiUrl = env.apiUrl
  private fullUrl = `${this.rootApiUrl}/engine`

  constructor(private http: HttpClient) { }

  startStopEngine(id: number, status: 'started' | 'stopped'): Observable<EngineResponseApiModel> {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('status', status);

    return this.http.patch<EngineResponseApiModel>(this.fullUrl, null, { params });
  }

  switchToDriveMode(id: number): Observable<{ success: boolean }> {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('status', 'drive');

    return this.http.patch<{ success: boolean }>(this.fullUrl, null, { params });
  }
}
