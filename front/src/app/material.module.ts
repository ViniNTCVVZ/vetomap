import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatInputModule, MatSelectModule, MatDialogModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FlexLayoutModule,
    MatDialogModule
  ],
  exports: [
    MatButtonModule, 
    MatInputModule,
    MatSelectModule,
    FlexLayoutModule,
    MatDialogModule
  ]
})
export class MaterialModule { }
