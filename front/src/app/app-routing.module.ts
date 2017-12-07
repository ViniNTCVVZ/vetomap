import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { LobbyGuard } from './guards/lobby.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'lobby/:token', component: LobbyComponent, canActivate: [LobbyGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes), // { enableTracing: true }
  ],
  exports: [RouterModule],
  providers: [LobbyGuard]
})
export class AppRoutingModule {}