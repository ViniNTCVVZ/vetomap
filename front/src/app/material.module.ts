import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatInputModule, MatSelectModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FlexLayoutModule
  ],
  exports: [
    MatButtonModule, 
    MatInputModule,
    MatSelectModule,
    FlexLayoutModule
  ]
})
export class MaterialModule { }
