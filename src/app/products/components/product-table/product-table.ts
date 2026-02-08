import { Component, input } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductimagePipe } from "../../pipes/image.pipe";
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Pagination } from "@shared/components/pagination/pagination";

@Component({
  selector: 'product-table',
  imports: [ProductimagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.html',
})
export class ProductTable {
  products = input.required<Product[]>();

}
