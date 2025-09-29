import { TestBed } from '@angular/core/testing';
import { ProductModule } from './product.module';

describe('ProductModule', () => {
  let productModule: ProductModule;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    productModule = new ProductModule();
  });

  it('should create an instance', () => {
    expect(productModule).toBeTruthy();
  });
});
