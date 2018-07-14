import {StompService, StompState} from '@stomp/ng2-stompjs';

export class MyStompService extends StompService {
  /**
   * It will disconnect from the STOMP broker.
   */
  public disconnect(): void {

    // Disconnect if connected. Callback will set CLOSED state
    if (this.client) {
      // Notify observers that we are disconnecting!
      this.state.next(StompState.DISCONNECTING);

      console.log('Calling disconnect');

      this.client.disconnect(
        () => this.state.next(StompState.CLOSED)
      );
    }
  }
}
