import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { Producto } from '../product';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductoService } from '../product.service';
import { InventarioService} from '../../inventario/inventario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBackdropService } from 'src/app/core/services/loading-backdrop.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
//import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatPaginator} from '@angular/material/paginator';
//import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import { ConfirmDialogComponent } from 'src/app/shared/utils/dialogs/confirm-dialog/confirm-dialog.component';
import {ToastrService} from 'ngx-toastr'
@Component({
    selector: 'app-producto-carrito-venta',
    templateUrl: './producto-carrito-venta.component.html',
    styleUrl: './producto-carrito-venta.component.scss',
    standalone: false, 
    //imports: [MatTableModule],
})
export class ProductoCarritoVentaComponent implements OnInit {
  @ViewChild(MatSort,{static: true}) sort: MatSort | null=null;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator| null=null;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'precio',  
    'cantidad',
    'stock', 
    'acciones',
  ];
  listaProductos:any[]=[];
  
  searchString = ''; 

  stock!:number;
  cantidad!:number;
  stock_suficiente=false;
  productos_carrito:any[]=[];

  constructor(
    private productoService:ProductoService,
    private inventarioService:InventarioService,
    private loadingBackdropService: LoadingBackdropService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private toastr:ToastrService,
    private dialogRef: MatDialogRef<ProductoCarritoVentaComponent>,
    ){}
  ngOnInit():void {
    this.cargarProductos();
    this.dataSource.paginator=this.paginator;
    this.dataSource.sort=this.sort;
  }
  close()
  {
    this.dialogRef.close(this.productos_carrito);
  }

  filtrarProductos() {
    this.dataSource.data = this.listaProductos.filter(producto => producto.name.toLowerCase().includes(this.searchString.toLowerCase()));
  }

  clearSearchInput()
  {
    this.searchString='';
    this.dataSource.data=this.listaProductos;
  }

  agregarProducto(producto: any) {
    if (this.stockSuficiente(producto)) {
      console.log('Agregar producto al carrito:', producto);
      this.toastr.success("Producto añadido correctamente", "Mensaje", {
        timeOut: 3000,
        positionClass: 'toast-bottom-center',
        closeButton: true,
        progressBar: true
      });

      
      this.productos_carrito.push(producto);
    } else {
      this.toastr.error("Cantidad no válida", "Error", {
        timeOut: 3000,
        positionClass: 'toast-bottom-center',
        closeButton: true,
        progressBar: true
      });
    }
  }

  cargarProductos()
  {

    this.productoService.listadoActivos()
    .subscribe({
      next:(res:any)=>{
        this.listaProductos=res.data;   
        //this.dataSource=new MatTableDataSource(this.listaProductos);     
        this.dataSource.data = this.listaProductos; // Actualiza el dataSource con los productos cargados       
        // Aplicar el filtro inicial si hay un valor en searchValue
      if (this.searchString) {
          this.filtrarProductos();
      }   
        console.log("lista productos",this.listaProductos);
        //console.log("dataSource",this.dataSource);
      },
      error:(ex)=>{
        console.log('error!!!');
        console.log(ex);

      }
    });  

  }

  stockSuficiente(producto:any):boolean
  {
    console.info("CANTIDAD INTRODUCIDA: ",producto)
    if(producto.quantity > 0 && producto.quantity <= producto.current_stock)
      {
        //this.stock_suficiente=true;
        return true;
      }
    return false;
  }

  onCustomerAddNavigate() {
    console.log("this.route: ",this.route)
    this.router.navigate(['new'], { relativeTo: this.route });
    
  }

  onCustomerDetailNavigate(id: number) {
    console.log("onCustomerDetailNavigate");
    this.router.navigate([id], { relativeTo: this.route });
  }

}

