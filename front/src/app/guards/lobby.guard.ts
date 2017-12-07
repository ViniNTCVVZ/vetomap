import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../services/api.service';
import { AppService } from '../services/app.service';

@Injectable()
export class LobbyGuard implements CanActivate {

  constructor(private api: ApiService, private app: AppService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.api.client_token = localStorage.getItem(next.params.token) || '';
    return this.api.joinLobby({ token: next.params.token, client_token: this.api.client_token })
    .catch( err => {
      console.log(err);
      this.app.onError.next(`The lobby you tried to access seems to be unreachable.
      You have been redirected to the homepage.`);
      this.router.navigate(['']);
      return false;
    });
  }
}
