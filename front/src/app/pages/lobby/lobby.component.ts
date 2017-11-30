import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  hasbeencopied: boolean = false;
  link: string = '';

  constructor() { 
    this.link = window.location.href;
  }

  ngOnInit() {
  }

}
