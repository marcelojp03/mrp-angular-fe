import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoCarritoVentaComponent } from './producto-carrito-venta.component';

describe('ProductoCarritoVentaComponent', () => {
  let component: ProductoCarritoVentaComponent;
  let fixture: ComponentFixture<ProductoCarritoVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoCarritoVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoCarritoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
