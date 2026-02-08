import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Product } from '@products/interfaces/product.interface';
import { ProductService } from '@products/services/products.service';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage {

  producService = inject(ProductService);


  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map((params) => params['idSlug'])
    )
  )

  ProductResource = rxResource( {

    stream: ({params}) =>{
       return this.producService.getProductByIdSlug(this.query())
    }
  })



}
