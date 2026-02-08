import { SlicePipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Product } from '@products/interfaces/product.interface';
import {  ProductimagePipe } from '@products/pipes/image.pipe';

@Component({
  selector: 'card-product',
  imports: [RouterLink,TitleCasePipe,SlicePipe,ProductimagePipe],
  templateUrl: './card-product.html',
})
export class CardProduct {
  product = input.required<Product>();



}
