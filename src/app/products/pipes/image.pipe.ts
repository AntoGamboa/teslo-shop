import { inject, Pipe, PipeTransform } from '@angular/core';
import { ProductService } from '@products/services/products.service';



@Pipe({
  name: 'ProductimagePipe'
})

export class ProductimagePipe implements PipeTransform {
  private producService = inject(ProductService);
  transform(value: null|string|string[]): string {


    if(value === null){
      return'./assets/images/tnqX9uSaQA6dxD6D0FMZ_no-image.jpg'
    }


    if(typeof value === 'string' && !value ) return'./assets/images/tnqX9uSaQA6dxD6D0FMZ_no-image.jpg'
    if(!value) return'./assets/images/tnqX9uSaQA6dxD6D0FMZ_no-image.jpg'
    if(value.length ===0) return './assets/images/tnqX9uSaQA6dxD6D0FMZ_no-image.jpg'

    if(typeof value === 'string' && value.startsWith('blob')) return value;
    if(typeof value === 'string') return this.producService.getImageRoute(value);
    else return this.producService.getImageRoute(value.at(0)!);
  }
}
