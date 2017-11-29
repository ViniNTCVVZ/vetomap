import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatInputModule, MatSelectModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [
    MatButtonModule, 
    MatInputModule,
    MatSelectModule
  ]
})
export class MaterialModule { }
