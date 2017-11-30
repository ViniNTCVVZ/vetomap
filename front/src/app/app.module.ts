import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

import { ApiService } from './services/api.service';
import { AppService } from './services/app.service';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RoomComponent } from './pages/room/room.component';
import { DialogComponent } from './dialog/dialog.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
    ClipboardModule
  ],
  declarations: [
    AppComponent, 
    HomeComponent,
    RoomComponent,
    DialogComponent
  ],
  bootstrap: [AppComponent],
  providers: [ApiService, AppService],
  entryComponents: [DialogComponent]
})
export class AppModule { }
