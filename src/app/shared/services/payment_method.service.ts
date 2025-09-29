import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private apiURL=environment.backend.host;


  constructor(private handler:HttpBackend,private http: HttpClient) {
    this.http=new HttpClient(handler);
  }

  obtenerTodos(): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
        })
      };
      let url=this.apiURL+"/metodo_pago/listar";
    return this.http.get<any>(url,httpOptions);
  }

  getPaymentTypes(): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
        })
      };
      let url=this.apiURL+"/forma_pago/listar";
    return this.http.get<any>(url,httpOptions);
  }

  buscar(id: number): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
        })
      };
      let url=this.apiURL+"/metodo_pago/buscar/"+id;
     return this.http.get<any>(url,httpOptions);
  }
  registrar(datos:any)
  {
    const httpOptions = {
      headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
      })
    };
    let url=this.apiURL+"/metodo_pago/registrar";
   return this.http.post(url,datos,httpOptions);
  }
  editar(datos:any)
  {
    const httpOptions = {
      headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
      })
    };
    let url=this.apiURL+"/metodo_pago/editar/"+datos.id;
    return this.http.post(url,datos,httpOptions);
  }

  eliminar(id:number)
  {
    const httpOptions = {
      headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
      })
    };
    let url=this.apiURL+"/metodo_pago/eliminar/"+id;
    return this.http.delete(url,httpOptions);
  }

  eliminar_Per(id:number)
  {
    const httpOptions = {
      headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
      })
    };
    let url=this.apiURL+"/metodo_pago/eliminar_per/"+id;
    return this.http.delete(url,httpOptions);
  }

  
  reactivar(id:number)
  {
    const httpOptions = {
      headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
      })
    };
    let url=this.apiURL+"/metodo_pago/reactivar/"+id;
    return this.http.delete(url,httpOptions);
  }

  // Otros métodos para crear, actualizar, eliminar categorías
}
