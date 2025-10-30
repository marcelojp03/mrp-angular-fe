import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkOrder, WorkOrderStatus } from './interfaces/work-order.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.backend.host;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 
      'Authorization': `Bearer ${this.authService.getAuthToken()}` 
    });
  }

  getWorkOrders(status?: WorkOrderStatus | null): Observable<any> {
    let url = `${this.apiUrl}/work-orders`;
    if (status) {
      url += `?status=${encodeURIComponent(status)}`;
    }
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products`, { headers: this.getHeaders() });
  }

  getWarehouses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/warehouses`, { headers: this.getHeaders() });
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  createWorkOrder(workOrder: Partial<WorkOrder>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/work-orders`, workOrder, { headers: this.getHeaders() });
  }

  cancelWorkOrder(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/work-orders/${id}/cancel`, {}, { headers: this.getHeaders() });
  }

  startWorkOrder(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/work-orders/${id}/start`, {}, { headers: this.getHeaders() });
  }

  finishWorkOrder(id: number, producedQuantity?: number): Observable<any> {
    const payload = producedQuantity ? { produced_quantity: producedQuantity } : {};
    return this.http.put<any>(`${this.apiUrl}/work-orders/${id}/finish`, payload, { headers: this.getHeaders() });
  }
}
