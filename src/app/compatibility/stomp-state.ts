/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * **This class has been deprecated in favor of `RxStompState`.
 * It will be dropped `@stomp/ng2-stompjs@8.x.x`.**
 *
 * Possible states for the STOMP service
 */
export enum StompState {
  CLOSED,
  TRYING,
  CONNECTED,
  DISCONNECTING,
}
