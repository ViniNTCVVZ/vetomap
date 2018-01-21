import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MapAction, Map } from '../../types/types';

@Component({
  selector: 'app-choose-map',
  templateUrl: './choose-map.component.html',
  styleUrls: ['./choose-map.component.css']
})
export class ChooseMapComponent implements OnInit {

  action: MapAction;
  maps: Map[] = [];

  constructor(public dialogRef: MatDialogRef<ChooseMapComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.action = data.action;
    this.maps = data.maps;
  }

  ngOnInit() {
  }

  chooseMap(map: Map) {
    this.dialogRef.close(map);
  }
}
