import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { Map, MapAction, Format, Mode, Room, MapActionResult, TeamSide } from '../../types/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  roomForm: FormGroup;
  currentFormat: Format;
  currentMode: Mode;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) { 
    this.currentFormat = this.api.formats.find(x => x.value === this.api.defaultFormat);
    this.currentMode = this.currentFormat.modes[0];
    this.roomForm = this.fb.group({
      team1: ['Team A', Validators.required],
      team2: ['Team B', Validators.required],
      format: [this.api.defaultFormat, Validators.required],
      mode: [this.currentMode, Validators.required]
    });
  }

  valid(): boolean {
    return this.roomForm.valid && this.validMapList();
  }

  ngOnInit() {
    this.roomForm.get('format').valueChanges.subscribe( (value: number) => {
      this.currentFormat = this.api.formats.find(x => x.value === value);
      this.currentMode = new Mode();
    });
    this.roomForm.get('mode').valueChanges.subscribe( (mode: Mode) => {
      this.currentMode = mode;
    });
  }

  validMapList(): boolean {
    return this.api.mapList.filter(x => x.picked).length >= +this.roomForm.get('format').value;
  }

  switchMap(map: Map): void {
    const concerned_map = this.api.mapList.find(x => x.name === map.name);
    concerned_map.picked = !concerned_map.picked;
  }

  createRoom() {
    if (this.valid()) {
      let new_room = new Room();
      new_room.remaining_maps = this.api.mapList.filter(x => x.picked);
      new_room.actions = this.currentMode.actions.map((x, indice) => new MapActionResult(null, x, (indice%2 === 0 ? TeamSide.A : TeamSide.B)));
      this.api.createRoom(new_room)
        .then( (room: Room) => {
          console.log(room);
          this.router.navigate(['/room/' + room.token]);
        })
        .catch( err => {

        });
    }
  }
}
