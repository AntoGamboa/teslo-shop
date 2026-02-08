import { Component, inject } from '@angular/core';

import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/products.service';
import { map } from 'rxjs';
import { CardProduct } from "@products/components/card-product/card-product";
import { genderPipe } from '@products/pipes/gender.pipe';
import { TitleCasePipe } from '@angular/common';
import { Pagination } from "@shared/components/pagination/pagination";
import { PagiantionService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [CardProduct, genderPipe, TitleCasePipe, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  gender = toSignal(
    inject(ActivatedRoute).params.pipe(
      map( (params) => params['gender'])
    )
  )


  private productsService = inject(ProductService);
  paginationService = inject(PagiantionService)


  producsResource = rxResource({
    params: () => ({
      gender:this.gender(),
      page:this.paginationService.getCurrentpage - 1


    }),
    stream:({params}) =>{
      return this.productsService.getProducts({
        gender:params.gender,
        offset: params.page * 9
      });
     // return this.productsService.getImage('7652410-00-A_0.jpg')
    }
  })

}
