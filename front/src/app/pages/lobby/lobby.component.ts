import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { ChooseMapComponent } from '../../dialog/choose-map/choose-map.component';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { Lobby, MapActionResult, TeamSide, TeamState, Map, MapAction } from '../../types/types';
import { ApiService } from '../../services/api.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  hasbeencopied = false;
  link = '';
  dialogRef: any;

  teamA: TeamSide = TeamSide.A;
  teamB: TeamSide = TeamSide.B;

  constructor(
    public api: ApiService,
    private dialog: MatDialog,
    private app: AppService,
    private router: Router) {
    this.link = window.location.href;
  }

  ngOnInit() {
    // if the first action is random pick, call vote on API.
    if (this.api.current_lobby.actions[0].action === MapAction.Random) {
      this.api.voteForMap(null)
      .catch(err => {
        this.app.onError.next(err);
      });
    }
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
      if (this.api.current_lobby.captainA === this.api.client_token) {
        return TeamState.YourTheCaptain;
      } else {
        return this.api.current_lobby.captainA === '' ? TeamState.NoCaptain : TeamState.SlotTaken;
      }
    } else {
      if (this.api.current_lobby.captainB === this.api.client_token) {
        return TeamState.YourTheCaptain;
      } else {
        return this.api.current_lobby.captainB === '' ? TeamState.NoCaptain : TeamState.SlotTaken;
      }
    }
  }

  chooseMap(action: MapActionResult) {
    this.dialogRef = this.dialog.open(ChooseMapComponent, {
      width: '800px',
      data: { action: action.action, maps: this.api.current_lobby.remaining_maps }
    });

    this.dialogRef.afterClosed().subscribe((result: Map) => {
      this.api.voteForMap(result)
      .catch(err => {
        this.app.onError.next(err);
      });
    });
  }

  finished(): boolean {
    return this.api.current_lobby.actions.findIndex(x => x.map.name === '') === -1;
  }

  chosenMaps(): Map[] {
    return this.api.current_lobby.actions.filter(x => x.action !== MapAction.Ban).map(x => x.map);
  }

  confirmLeavingPage() {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: 'Do you really want to leave this page and lose your ongoing map veto ?'
    });

    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.router.navigate(['']);
      }
    });
  }

  getActionClasses(action: MapActionResult): any {
    return {
      'past': action.map.name !== '',
      'picked': action.action === 'PICK',
      'banned': action.action === 'BAN',
      'random': action.action === 'RANDOM'
    };
  }

  getActionLibelle(action: MapActionResult, index: number): string {
    if (action.action === 'RANDOM') {
      return 'Server PICK';
    } else {
      if (index % 2 === 0) {
        return `${this.api.current_lobby.nameTeamA} ${action.action}`;
      } else {
        return `${this.api.current_lobby.nameTeamB} ${action.action}`;
      }
    }
  }
}
