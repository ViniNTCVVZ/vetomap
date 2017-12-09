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
import { LobbyComponent } from './pages/lobby/lobby.component';
import { InfoDialogComponent } from './dialog/info-dialog/info-dialog.component';
import { ChooseMapComponent } from './dialog/choose-map/choose-map.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { Nl2BrPipe } from './pipes/nl2br.pipe';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';

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
    LobbyComponent,
    InfoDialogComponent,
    ConfirmDialogComponent,
    ChooseMapComponent,
    NotFoundComponent,
    Nl2BrPipe
  ],
  bootstrap: [AppComponent],
  providers: [ApiService, AppService],
  entryComponents: [InfoDialogComponent, ConfirmDialogComponent, ChooseMapComponent]
})
export class AppModule { }
