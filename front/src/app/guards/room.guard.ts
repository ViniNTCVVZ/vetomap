import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../services/api.service';

@Injectable()
export class RoomGuard implements CanActivate {

  constructor(private api: ApiService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.api.joinRoom(next.params.token)
    .catch( err => {
      this.router.navigate(['']);
      return false;
    });
  }
}
