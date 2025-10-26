import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { OrderParams } from '../../shared/models/orderParams';
import { Order } from '../../shared/models/order';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  getOrders(orderParams: OrderParams) {
    let params = new HttpParams();
    if (orderParams.filter && orderParams.filter !== 'All') {
      params = params.append('status', orderParams.filter);
    }
    params = params.append('pageSize', orderParams.pageSize);
    params = params.append('pageIndex', orderParams.pageNumber);

    console.log('>>> getOrders called with params:', params.toString());

    return this.http.get<Pagination<Order>>(this.baseUrl + 'admin/orders', {params}).pipe(
      tap(response => console.log('>>> getOrders response:', response)),
      catchError(this.handleError)
    );
  }

  getOrder(id: number) {
    return this.http.get<Order>(this.baseUrl + 'admin/orders/' + id).pipe(
      catchError(this.handleError)
    );
  }

  refundOrder(id: number) {
    return this.http.post<Order>(this.baseUrl + 'admin/orders/refund/' + id, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Product methods
  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brands && shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));
    }
    if (shopParams.types && shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));
    }
    if (shopParams.sort) {
      params = params.append('sort', shopParams.sort);
    }
    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }
    params = params.append('pageSize', shopParams.pageSize.toString());
    params = params.append('pageIndex', shopParams.pageNumber.toString());

    const url = this.baseUrl + 'products';
    console.log('>>> getProducts called');
    console.log('>>> URL:', url);
    console.log('>>> Params:', params.toString());
    console.log('>>> ShopParams object:', shopParams);

    return this.http.get<Pagination<Product>>(url, {params}).pipe(
      tap(response => {
        console.log('>>> getProducts SUCCESS response:', response);
        console.log('>>> Products count:', response?.count);
        console.log('>>> Products data length:', response?.data?.length);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('>>> getProducts ERROR:', error);
        console.error('>>> Error status:', error.status);
        console.error('>>> Error message:', error.message);
        console.error('>>> Error body:', error.error);
        return this.handleError(error);
      })
    );
  }

  getProduct(id: number) {
    console.log('>>> getProduct called for id:', id);
    return this.http.get<Product>(this.baseUrl + 'products/' + id).pipe(
      tap(product => console.log('>>> getProduct response:', product)),
      catchError(this.handleError)
    );
  }

  createProduct(product: Product) {
    console.log('>>> createProduct called with:', product);
    return this.http.post<Product>(this.baseUrl + 'products', product).pipe(
      tap(response => console.log('>>> createProduct response:', response)),
      catchError(this.handleError)
    );
  }

  updateProduct(product: Product) {
    console.log('>>> updateProduct called with:', product);
    return this.http.put<Product>(this.baseUrl + 'products/' + product.id, product).pipe(
      tap(response => console.log('>>> updateProduct response:', response)),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number) {
    console.log('>>> deleteProduct called for id:', id);
    return this.http.delete(this.baseUrl + 'products/' + id).pipe(
      tap(() => console.log('>>> deleteProduct success')),
      catchError(this.handleError)
    );
  }

  getBrands() {
    console.log('>>> getBrands called');
    return this.http.get<string[]>(this.baseUrl + 'products/brands').pipe(
      tap(brands => console.log('>>> getBrands response:', brands)),
      catchError(this.handleError)
    );
  }

  getTypes() {
    console.log('>>> getTypes called');
    return this.http.get<string[]>(this.baseUrl + 'products/types').pipe(
      tap(types => console.log('>>> getTypes response:', types)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error (${error.status}): ${error.message}`;

      if (error.error?.errors) {
        // Validation errors from API
        const validationErrors = Object.values(error.error.errors).flat();
        errorMessage += '\n' + validationErrors.join('\n');
      } else if (error.error?.message) {
        errorMessage += '\n' + error.error.message;
      }
    }

    console.error('>>> Full error object:', error);
    console.error('>>> Error message:', errorMessage);

    return throwError(() => error);
  }
}
