import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Inventory {
  id?: number;
  product_id: number;
  warehouse_id: number;
  current_stock: string; // Viene como string del API
  stock_minimo?: number;
  stock_maximo?: number;
  ubicacion?: string;
  estado?: boolean;
  // Campos de relación que vienen del API
  product_name?: string;
  warehouse_name?: string;
  // Campos mapeados para compatibilidad
  id_producto?: number;
  id_almacen?: number;
  stock?: number;
  producto?: { nombre?: string };
  almacen?: { nombre?: string };
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiURL = environment.backend.host;
  private apiReportesURL = environment.backend.reportes;

  obtenerListaInventario(): Observable<any> {
    let url = this.apiURL + "/product-warehouses";
    return this.http.get<any>(url);
  }

  buscarPorIds(id_producto: number, id_almacen: number): Observable<any> {
    // El backend no tiene endpoint específico para buscar por IDs
    // Se puede filtrar del listado completo en el componente
    let url = this.apiURL + "/product-warehouses";
    return this.http.get<any>(url);
  }

  obtenerStock(id_producto: number): Observable<any> {
    let url = this.apiURL + "/stocks?product_id=" + id_producto;
    return this.http.get<any>(url);
  }

  registrarInventario(inventory: Inventory): Observable<any> {
    let url = this.apiURL + "/product-warehouses";
    return this.http.post(url, inventory);
  }

  actualizarInventario(inventory: Inventory): Observable<any> {
    let url = this.apiURL + "/product-warehouses/" + inventory.id_producto + "/" + inventory.id_almacen;
    return this.http.put(url, inventory);
  }

  eliminarInventario(id_producto: number, id_almacen: number): Observable<any> {
    // El backend no tiene DELETE para product-warehouses según la documentación
    // Se debe usar PUT con estado inactivo
    let url = this.apiURL + "/product-warehouses/" + id_producto + "/" + id_almacen;
    return this.http.put(url, { estado: false });
  }

  reactivarInventario(id_producto: number, id_almacen: number): Observable<any> {
    let url = this.apiURL + "/product-warehouses/" + id_producto + "/" + id_almacen;
    return this.http.put(url, { estado: true });
  }

  imprimirReporte(datos: any): Observable<any> {
    let url = this.apiReportesURL + "/producto/listado";
    return this.http.post(url, datos);
  }
}
