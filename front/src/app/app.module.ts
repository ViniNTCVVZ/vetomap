import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { ApiService } from './services/api.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RoomComponent } from './pages/room/room.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent, 
    HomeComponent,
    RoomComponent
  ],
  bootstrap: [AppComponent],
  providers: [ApiService]
})
export class AppModule { }
