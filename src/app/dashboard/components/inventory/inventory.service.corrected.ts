import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Inventory {
  id?: number;
  id_producto: number;
  id_almacen: number;
  stock: number;
  stock_minimo?: number;
  stock_maximo?: number;
  ubicacion?: string;
  estado?: boolean;
  // Campos de relación
  producto?: any;
  almacen?: any;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiURL = environment.backend.host;
  private apiReportesURL = environment.backend.reportes;

  constructor(private handler: HttpBackend, private http: HttpClient) {
    this.http = new HttpClient(handler);
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
  }

  obtenerListaInventario(): Observable<any> {
    let url = this.apiURL + "/producto-almacen/listado/todos";
    return this.http.get<any>(url, this.getHttpOptions());
  }

  buscarPorIds(id_producto: number, id_almacen: number): Observable<any> {
    let url = this.apiURL + "/producto-almacen/buscar/" + id_producto + "/" + id_almacen;
    return this.http.get<any>(url, this.getHttpOptions());
  }

  obtenerStock(id_producto: number): Observable<any> {
    let url = this.apiURL + "/producto-almacen/obtener-stock/" + id_producto;
    return this.http.get<any>(url, this.getHttpOptions());
  }

  registrarInventario(inventory: Inventory): Observable<any> {
    let url = this.apiURL + "/producto-almacen/registrar";
    return this.http.post(url, inventory, this.getHttpOptions());
  }

  actualizarInventario(inventory: Inventory): Observable<any> {
    let url = this.apiURL + "/producto-almacen/editar/" + inventory.id_producto + "/" + inventory.id_almacen;
    return this.http.post(url, inventory, this.getHttpOptions());
  }

  eliminarInventario(id_producto: number, id_almacen: number): Observable<any> {
    let url = this.apiURL + "/producto-almacen/editar/" + id_producto + "/" + id_almacen;
    return this.http.delete(url, this.getHttpOptions());
  }

  reactivarInventario(id_producto: number, id_almacen: number): Observable<any> {
    // Nota: El servicio original tenía un error, debería ser producto-almacen en lugar de subcategorias
    let url = this.apiURL + "/producto-almacen/reactivar/" + id_producto + "/" + id_almacen;
    return this.http.delete(url, this.getHttpOptions());
  }

  imprimirReporte(datos: any): Observable<any> {
    let url = this.apiReportesURL + "/producto/listado";
    return this.http.post(url, datos, this.getHttpOptions());
  }
}
