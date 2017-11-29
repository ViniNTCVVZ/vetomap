import { Component, OnInit } from '@angular/core';
import { Map, MapAction, Format, Mode } from '../../types/types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  roomForm: FormGroup;

  modes

  mapList: Map[] = [
    new Map('cache', true),
    new Map('cobblestone', true),
    new Map('dust2', false),
    new Map('inferno', true),
    new Map('mirage', true),
    new Map('nuke', true),
    new Map('overpass', true),
    new Map('train', true)
  ];

  formats: Format[] = [
    new Format('Best of 1', 1, [
      new Mode('Ban ... Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Random
      ]),
      new Mode('Ban x2, Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Random
      ]),
      new Mode('Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Random
      ]),
      new Mode('Random', [
        MapAction.Random
      ])
    ]),
    new Format('Best of 2', 2, [
      new Mode('Ban x2, Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Random, MapAction.Random
      ]),
      new Mode('Ban x2, Ban x2 then Pick x2', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick
      ]),
      new Mode('Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Random, MapAction.Random
      ]),
      new Mode('Pick x2', [
        MapAction.Pick, MapAction.Pick
      ]),
      new Mode('Random', [
        MapAction.Random, MapAction.Random
      ]),
    ]),
    new Format('Best of 3', 3, [
      new Mode('Ban x2, Pick x2, Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Ban, MapAction.Ban, MapAction.Random
      ]),
      new Mode('Ban x2, Ban x2, Pick x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Ban x2, Pick x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Ban x2, Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Random, MapAction.Random, MapAction.Random
      ]),
      new Mode('Pick x2 then Random', [
        MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Random', [
        MapAction.Random, MapAction.Random, MapAction.Random
      ]),
    ]),
    new Format('Best of 5', 5, [
      new Mode('Ban x2, Pick x2, Pick x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Pick x2, Ban x2, Pick x2 then Random', [
        MapAction.Pick, MapAction.Pick, MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Pick x2, Pick x2, Ban x2 then Random', [
        MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Ban, MapAction.Ban, MapAction.Random
      ]),
      new Mode('Pick x2, Pick x2 then Random', [
        MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Pick, Ban, Pick, Ban, Pick, Pick then Random', [
        MapAction.Pick, MapAction.Ban, MapAction.Pick, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Random', [
        MapAction.Random, MapAction.Random, MapAction.Random, MapAction.Random, MapAction.Random
      ]),
    ])
  ];

  constructor(private fb: FormBuilder) { 

    this.roomForm = this.fb.group({
      team1: ['Team A', Validators.required],
      team2: ['Team B', Validators.required],
      format: [3, Validators.required]
    });
  }

  ngOnInit() {
  }

  validMapList(): boolean {
    return this.mapList.filter(x => x.picked).length >= +this.roomForm.get('format').value;
  }

  switchMap(map: Map): void {
    const concerned_map = this.mapList.find(x => x.name === map.name);
    concerned_map.picked = !concerned_map.picked;
  }

}
