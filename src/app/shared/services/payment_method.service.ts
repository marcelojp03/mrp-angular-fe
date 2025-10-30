import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private http = inject(HttpClient);
  private apiURL = environment.backend.host;

  obtenerTodos(): Observable<any> {
    let url = this.apiURL + "/metodo_pago/listar";
    return this.http.get<any>(url);
  }

  getPaymentTypes(): Observable<any> {
    let url = this.apiURL + "/forma_pago/listar";
    return this.http.get<any>(url);
  }

  buscar(id: number): Observable<any> {
    let url = this.apiURL + "/metodo_pago/buscar/" + id;
    return this.http.get<any>(url);
  }

  registrar(datos: any) {
    let url = this.apiURL + "/metodo_pago/registrar";
    return this.http.post(url, datos);
  }

  editar(datos: any) {
    let url = this.apiURL + "/metodo_pago/editar/" + datos.id;
    return this.http.post(url, datos);
  }

  eliminar(id: number) {
    let url = this.apiURL + "/metodo_pago/eliminar/" + id;
    return this.http.delete(url);
  }

  eliminar_Per(id: number) {
    let url = this.apiURL + "/metodo_pago/eliminar_per/" + id;
    return this.http.delete(url);
  }

  reactivar(id: number) {
    let url = this.apiURL + "/metodo_pago/reactivar/" + id;
    return this.http.delete(url);
  }
}
