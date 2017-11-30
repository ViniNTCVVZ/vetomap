import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  hasbeencopied: boolean = false;
  link: string = '';

  constructor() { 
    this.link = window.location.href;
  }

  ngOnInit() {
  }

}
