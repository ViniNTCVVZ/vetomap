import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { AppService } from '../../services/app.service';
import { Map, MapAction, Format, Mode, Lobby, MapActionResult, TeamSide } from '../../types/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  lobbyForm: FormGroup;
  currentFormat: Format;
  currentMode: Mode;

  constructor(public api: ApiService, private fb: FormBuilder, private app: AppService, private router: Router) { 
    this.currentFormat = this.api.formats.find(x => x.value === this.api.defaultFormat);
    this.currentMode = this.currentFormat.modes[0];
    this.lobbyForm = this.fb.group({
      team1: ['Team A', Validators.required],
      team2: ['Team B', Validators.required],
      format: [this.api.defaultFormat, Validators.required],
      mode: [this.currentMode, Validators.required]
    });
  }

  valid(): boolean {
    return this.lobbyForm.valid && this.validMapList();
  }

  ngOnInit() {
    this.lobbyForm.get('format').valueChanges.subscribe( (value: number) => {
      this.currentFormat = this.api.formats.find(x => x.value === value);
      this.currentMode = new Mode();
    });
    this.lobbyForm.get('mode').valueChanges.subscribe( (mode: Mode) => {
      this.currentMode = mode;
    });
  }

  validMapList(): boolean {
    return !this.currentMode || this.api.mapList.filter(x => x.picked).length >= this.currentMode.actions.length;
  }

  switchMap(map: Map): void {
    const concerned_map = this.api.mapList.find(x => x.name === map.name);
    concerned_map.picked = !concerned_map.picked;
  }

  createLobby() {
    if (this.valid()) {
      let new_lobby = new Lobby();
      new_lobby.remaining_maps = this.api.mapList.filter(x => x.picked);
      new_lobby.actions = this.currentMode.actions.map((x, indice) => new MapActionResult(null, x, (indice%2 === 0 ? TeamSide.A : TeamSide.B)));
      this.api.createLobby(new_lobby)
        .then( (lobby: Lobby) => {
          console.log(lobby);
          this.router.navigate(['/lobby/' + lobby.token]);
        })
        .catch( err => {
          this.app.onError.next(err);
        });
    }
  }
}
