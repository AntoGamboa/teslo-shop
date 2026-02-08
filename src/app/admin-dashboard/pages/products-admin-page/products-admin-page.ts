import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTable } from "@products/components/product-table/product-table";
import { ProductService } from '@products/services/products.service';
import { Pagination } from "@shared/components/pagination/pagination";
import { PagiantionService } from '@shared/components/pagination/pagination.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  productsService = inject(ProductService);
  paginationService = inject(PagiantionService);
  limit = signal(10)

  productResource = rxResource({
    params:() => ({
      page:this.paginationService.getCurrentpage - 1,
      offset:this.limit()
    }),
    stream:({params}) =>{
       return this.productsService.getProducts({
        offset: params.page * 10,
        limit:params.offset


       })
    }
  });



}
