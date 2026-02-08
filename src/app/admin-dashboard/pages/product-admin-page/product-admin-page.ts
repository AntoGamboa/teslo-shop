import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@products/services/products.service';
import { map } from 'rxjs';
import { NotFoundPage } from "@store-front/pages/not-found-page/not-found-page";
import { ProductDetails } from "./product-details/product-details";

@Component({
  selector: 'app-product-admin-page',
  imports: [ NotFoundPage, ProductDetails],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)
  productService = inject(ProductService)

  productId= toSignal(
    this.activatedRoute.params.pipe(
      map( (params) => params['id'])
    )
  )
  productResource = rxResource({
    params: () => ({id: this.productId() }),
    stream: ({params}) =>{
      return this.productService.getProductById(params.id)
    }
    }
  );

}
