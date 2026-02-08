import { Gender, Product } from './../interfaces/product.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { ProductsResponse } from '@products/interfaces/product.interface';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const SECTION_PRODUCTS = '/products';
const GET_IMAGE = '/files/product'
const API_BASE = environment.apiBaseUrl;

interface Options {
  limit?: number,
  offset?: number,
  gender?: string

}
const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
}


@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient)

  private ProductsCache = new Map<string, ProductsResponse>();
  private ProductCache = new Map<string, Product>();





  getImageRoute(imgName: string): string {
    return `${API_BASE + GET_IMAGE}/${imgName}`
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {

    const key = idSlug;
    if (this.ProductCache.has(key)) {
      return of(this.ProductCache.get(key)!)
    }

    return this.http.get<Product>(`${API_BASE + SECTION_PRODUCTS}/${idSlug}`)
      .pipe(
        tap((resp) => console.log(resp)),
        tap((product) => this.ProductCache.set(key, product))
      )

  }
  getProductById(id: string): Observable<Product> {

    if (id === 'new') {
      return of(emptyProduct);
    }

    const key = id;
    if (this.ProductCache.has(key)) {
      return of(this.ProductCache.get(key)!)
    }

    return this.http.get<Product>(`${API_BASE + SECTION_PRODUCTS}/${id}`)
      .pipe(
        tap((resp) => console.log(resp)),
        tap((product) => this.ProductCache.set(key, product))
      )

  }

  getProducts(options: Options): Observable<ProductsResponse> {



    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;
    if (this.ProductsCache.has(key)) {

      return of(this.ProductsCache.get(key)!)
    }

    return this.http.get<ProductsResponse>(`${API_BASE + SECTION_PRODUCTS}`, {
      params: {
        limit: limit,
        offset: offset,
        gender: gender
      }
    })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.ProductsCache.set(key, resp))

      );;
  }
  updateProduct(id: string, product: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    const currentImages = product.images ?? [];
    return this.uploadImages(imageFileList)
      .pipe(
        map(imagesNames => ({
          ...product,
          images: [...currentImages, ...imagesNames]
        })),
        switchMap((updatedProduct) => (
          this.http.patch<Product>(`${API_BASE + SECTION_PRODUCTS}/${id}`, updatedProduct)
            .pipe(
              tap((product) => this.updateProductCache(product))
            )
        ))
      );
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
      const currentImages = productLike.images ?? [];
      return this.uploadImages(imageFileList)
      .pipe(
        map( (imagesName) =>({
          ...productLike,
          images:[...currentImages,...imagesName]
        })),
        switchMap((createdProduct) =>
          this.http.post<Product>(`${API_BASE + SECTION_PRODUCTS}`, createdProduct)
          .pipe(
            tap( (product) => this.updateProductCache(product))
          )

        )
      )
    /* return this.http.post<Product>(`${API_BASE + SECTION_PRODUCTS}`, productLike)
      .pipe(
        tap((product) => this.updateProductCache(product))
      )
      ; */
  }

  updateProductCache(product: Product) {
    const productId = product.id;
    this.ProductCache.set(productId, product)

    this.ProductsCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map(
        currentProduct => currentProduct.id === productId ? product : currentProduct
      )

    })

  }
  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);
    const uploadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile))
    return forkJoin(uploadObservables).pipe(
      tap((imageNames) => console.log(imageNames))
    )
  }
  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile)
    return this.http.post<{ fileName: string }>(`${API_BASE}/files/product`, formData)
      .pipe(
        map(resp => resp.fileName)
      )

  }

}
