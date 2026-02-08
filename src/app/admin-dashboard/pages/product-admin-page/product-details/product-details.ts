import { Product } from './../../../../products/interfaces/product.interface';
import { Component, computed, effect, inject, input, linkedSignal, OnInit, signal } from '@angular/core';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/forms.utils';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";
import { ProductService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom, single } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {


  product = input.required<Product>();
  producService = inject(ProductService);
  fb = inject(FormBuilder);
  router = inject(Router)
  wasSaved = signal(false);
  imageFileList:FileList| undefined = undefined
  tempImages = signal<string[]>([])
  images = signal<string[]>([]);


  productForm = this.fb.group({
    title: ["", [Validators.required]],
    description: ["", [Validators.required]],
    slug: ["", [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
  })

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']


  async onSubmit() {

    const isvalid = this.productForm.valid
    this.productForm.markAllAsTouched();
    if (!isvalid) return;
    let formValue = this.productForm.value;


    const productLike: Partial<Product> = {
      ...(formValue) as any,
      tags:
        formValue.tags!
          .toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],

    }
    if (this.product().id === 'new') {
      const product = await firstValueFrom(
         this.producService.createProduct(productLike,this.imageFileList)
      )

          this.router.navigate(['/admin/product',product.id])



    }
    else {
      await firstValueFrom(
        this.producService.updateProduct(this.product().id, productLike,this.imageFileList)
      )

      this.wasSaved.set(true)
      setInterval(() => {
         this.wasSaved.set(false)
      }, 3000);

    }

  }
  onSizeClick(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1)
    }
    else {
      currentSizes.push(size)
    }
    this.productForm.patchValue({ sizes: currentSizes })

  }

  ngOnInit(): void {
    this.setFormValue(this.product())
    if(this.product().images){
      this.images.set(this.product().images)
    }
  }
  setFormValue(formLike: Partial<Product>) {


    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') })


  }
  onFilesChange(event:Event){
    const fileList = (event.target as HTMLInputElement).files
    this.imageFileList = fileList ?? undefined
    const imageUrls = Array.from(fileList ?? []).map(
      file =>
        URL.createObjectURL(file)
      )
      this.tempImages.set(imageUrls)
      const newimages = Array.from([...imageUrls,...this.product().images])
      this.images.set(newimages)
      console.log(this.images());

  }


}
