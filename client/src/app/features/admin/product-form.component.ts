import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.product ? 'Edit Product' : 'Add New Product' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="productForm" class="flex flex-col gap-4">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Product name">
          @if (productForm.get('name')?.hasError('required') && productForm.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Product description" rows="3"></textarea>
          @if (productForm.get('description')?.hasError('required') && productForm.get('description')?.touched) {
            <mat-error>Description is required</mat-error>
          }
        </mat-form-field>

        <div class="flex gap-4">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Price</mat-label>
            <input matInput type="number" formControlName="price" placeholder="0.00" step="0.01">
            @if (productForm.get('price')?.hasError('required') && productForm.get('price')?.touched) {
              <mat-error>Price is required</mat-error>
            }
            @if (productForm.get('price')?.hasError('min')) {
              <mat-error>Price must be positive</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Quantity in Stock</mat-label>
            <input matInput type="number" formControlName="quantityInStock" placeholder="0">
            @if (productForm.get('quantityInStock')?.hasError('required') && productForm.get('quantityInStock')?.touched) {
              <mat-error>Quantity is required</mat-error>
            }
            @if (productForm.get('quantityInStock')?.hasError('min')) {
              <mat-error>Quantity must be positive</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Brand</mat-label>
          <mat-select formControlName="brand">
            @for (brand of data.brands; track brand) {
              <mat-option [value]="brand">{{brand}}</mat-option>
            }
          </mat-select>
          @if (productForm.get('brand')?.hasError('required') && productForm.get('brand')?.touched) {
            <mat-error>Brand is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            @for (type of data.types; track type) {
              <mat-option [value]="type">{{type}}</mat-option>
            }
          </mat-select>
          @if (productForm.get('type')?.hasError('required') && productForm.get('type')?.touched) {
            <mat-error>Type is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Picture URL</mat-label>
          <input matInput formControlName="pictureUrl" placeholder="https://...">
          @if (productForm.get('pictureUrl')?.hasError('required') && productForm.get('pictureUrl')?.touched) {
            <mat-error>Picture URL is required</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!productForm.valid">
        {{ data.product ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ProductFormComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ProductFormComponent>);
  private fb = inject(FormBuilder);

  productForm: FormGroup = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    pictureUrl: ['', Validators.required],
    type: ['', Validators.required],
    brand: ['', Validators.required],
    quantityInStock: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    if (this.data.product) {
      this.productForm.patchValue(this.data.product);
    }
  }

  onSave(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
