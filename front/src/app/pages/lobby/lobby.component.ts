import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Lobby, MapActionResult, TeamSide, TeamState } from '../../types/types';
import { ApiService } from '../../services/api.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  hasbeencopied: boolean = false;
  link: string = '';

  constructor(public api: ApiService, private app: AppService, private router: Router) { 
    this.link = window.location.href;
  }

  ngOnInit() {
  }

  myturn(action: MapActionResult, index: number): boolean {
    return action.map.name === '' &&  index === this.api.current_lobby.actions.findIndex(x => x.map.name === '') && (
      (this.api.current_lobby.captainA === this.api.client_token && action.side === TeamSide.A) ||
      (this.api.current_lobby.captainB === this.api.client_token && action.side === TeamSide.B)
    );
  }

  joinAsCaptain(side: TeamSide): void {
    this.api.joinAsCaptain(side)
    .catch( err => {
      this.app.onError.next(err);
    });
  }

  canJoinAsCaptain(side: TeamSide): TeamState {
    if (side === TeamSide.A) {
      if (this.api.current_lobby.captainA === this.api.client_token) return TeamState.YourTheCaptain;
      else return this.api.current_lobby.captainA === '' ? TeamState.NoCaptain : TeamState.SlotTaken;
    } else {
      if (this.api.current_lobby.captainB === this.api.client_token) return TeamState.YourTheCaptain;
      else return this.api.current_lobby.captainB === '' ? TeamState.NoCaptain : TeamState.SlotTaken;
    }
  }
}