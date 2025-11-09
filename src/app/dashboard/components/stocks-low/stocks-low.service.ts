import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StockLowResponse } from './stocks-low.interface';

@Injectable({
  providedIn: 'root'
})
export class StocksLowService {
  private http = inject(HttpClient);
  private apiUrl = environment.backend.host;

  getStocksLow(): Observable<StockLowResponse> {
    return this.http.get<StockLowResponse>(`${this.apiUrl}/stocks/low`);
  }
}
