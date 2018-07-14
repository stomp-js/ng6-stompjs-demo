
import {filter, map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import { StompService, StompState } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  public state: Observable<string>;

  /** Constructor */
  constructor(private _stompService: StompService) { }

  ngOnInit() {
    console.log('Status init');
    this.state = this._stompService.state.pipe(
      map((state: number) => {
        console.log(`Current state: ${StompState[state]}`);
        return StompState[state];
      })
    );

    const MAX_RETRIES = 3;
    let numRetries = MAX_RETRIES;

    this._stompService.state.pipe(
      filter((state: number) => state === StompState.CLOSED)
    ).subscribe(() => {
      console.log(`Will retry ${numRetries} times`);
      if (numRetries <= 0) {
        this._stompService.disconnect();
      }
      numRetries--;
    });

    this._stompService.connectObservable.subscribe(() => {
      numRetries = MAX_RETRIES;
    });
  }

  connect() {
    this._stompService.initAndConnect();
  }

  disconnect() {
    this._stompService.disconnect();
  }
}
