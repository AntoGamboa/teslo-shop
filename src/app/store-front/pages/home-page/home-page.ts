
import { Component, inject, input } from '@angular/core';
import { ProductService } from '@products/services/products.service';
import { CardProduct } from '@products/components/card-product/card-product';
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { Pagination } from "@shared/components/pagination/pagination";
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PagiantionService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [CardProduct, Pagination],
  templateUrl: './home-page.html',
})
export class HomePage {


  private productsService = inject(ProductService);
  paginationService = inject(PagiantionService)

  producsResource = rxResource({
    params: ()=>({page: this.paginationService.getCurrentpage - 1}),
    stream:({params}) =>{
      return this.productsService.getProducts({
        offset: params.page * 9
      });
     // return this.productsService.getImage('7652410-00-A_0.jpg')
    }
  })




}
