
import {filter, map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import {RxStompService} from '@stomp/ng2-stompjs';
import {RxStompState} from '@stomp/rx-stomp';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  public state: Observable<string>;

  /** Constructor */
  constructor(private _stompService: RxStompService) { }

  ngOnInit() {
    console.log('Status init');
    this.state = this._stompService.connectionState$.pipe(
      map((state: number) => {
        console.log(`Current state: ${RxStompState[state]}`);
        return RxStompState[state];
      })
    );

    const MAX_RETRIES = 3;
    let numRetries = MAX_RETRIES;

    this._stompService.connectionState$.pipe(
      filter((state: number) => state === RxStompState.CLOSED)
    ).subscribe(() => {
      console.log(`Will retry ${numRetries} times`);
      if (numRetries <= 0) {
        this._stompService.deactivate();
      }
      numRetries--;
    });

    this._stompService.connected$.subscribe(() => {
      numRetries = MAX_RETRIES;
    });
  }

  connect() {
    this._stompService.activate();
  }

  disconnect() {
    this._stompService.deactivate();
  }
}
