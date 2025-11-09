import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { 
  WorkOrdersResponse, 
  ProductsResponse, 
  WarehousesResponse, 
  UsersResponse,
  WorkOrder, 
  WorkOrderStatus,
  StartWorkOrderResponse,
  FinishWorkOrderResponse
} from './interfaces/work-order.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {
  private http = inject(HttpClient);
  private apiUrl = environment.backend.host;

  getWorkOrders(status?: WorkOrderStatus | null): Observable<WorkOrdersResponse> {
    let url = `${this.apiUrl}/work-orders`;
    if (status) {
      url += `?status=${encodeURIComponent(status)}`;
    }
    return this.http.get<WorkOrdersResponse>(url);
  }

  getWorkOrder(id: number): Observable<{ data: WorkOrder; success: boolean; message: string }> {
    return this.http.get<{ data: WorkOrder; success: boolean; message: string }>(`${this.apiUrl}/work-orders/${id}`);
  }

  getProducts(): Observable<ProductsResponse> {
    // Usar endpoint específico que retorna solo productos con BOM activa
    return this.http.get<ProductsResponse>(`${this.apiUrl}/boms/products-with-active-bom`);
  }

  getWarehouses(): Observable<WarehousesResponse> {
    return this.http.get<WarehousesResponse>(`${this.apiUrl}/warehouses`);
  }

  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`);
  }

  createWorkOrder(workOrder: Partial<WorkOrder>): Observable<{ data: WorkOrder; success: boolean; message: string }> {
    return this.http.post<{ data: WorkOrder; success: boolean; message: string }>(`${this.apiUrl}/work-orders`, workOrder);
  }

  updateWorkOrder(id: number, workOrder: Partial<WorkOrder>): Observable<{ data: WorkOrder; success: boolean; message: string }> {
    return this.http.put<{ data: WorkOrder; success: boolean; message: string }>(`${this.apiUrl}/work-orders/${id}`, workOrder);
  }

  cancelWorkOrder(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.apiUrl}/work-orders/${id}/cancel`, {});
  }

  startWorkOrder(id: number): Observable<StartWorkOrderResponse> {
    return this.http.put<StartWorkOrderResponse>(`${this.apiUrl}/work-orders/${id}/start`, {});
  }

  finishWorkOrder(id: number, data?: { produced_quantity?: number }): Observable<FinishWorkOrderResponse> {
    return this.http.put<FinishWorkOrderResponse>(`${this.apiUrl}/work-orders/${id}/finish`, data || {});
  }
}
