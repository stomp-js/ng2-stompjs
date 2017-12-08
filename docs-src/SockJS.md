# Using with SockJS

See sample at https://github.com/stomp-js/ng4-stompjs-demo/tree/sockjs

## Notes

- Currently it is initial support.
- The configuration overrides the `url`
to be used a `socketProvider` function. It will be streamlined in next
minor release.
- Please read notes on SockJS support of the underlying library at
https://stomp-js.github.io/stomp-websocket/codo/extra/docs-src/sockjs.md.html
- When developing the SockJS code, please adjust the unit tests to use
SockJS.
- Unit testes may occasionally fail in SockJS. It is because of limitations
of SockJS around allowing only one SockJS connection at a time. Usually 
this should not affect your usage of the library.

## Usage

### Install SockJS Client

```bash
$ npm install sockjs-client --save
```

### Import SockJS class

```typescript
import * as SockJS from 'sockjs-client';
```

### Implement a socketProvider

Create a function that returns an object similar to WebSocket (typically SockJS instance).

```typescript
export function socketProvider() {
  return new SockJS('http://127.0.0.1:15674/stomp');
}
```

### StompConfig

Pass it as `url` in `StompConfig`. Do not worry it will work even
though name of the parameter is url.

Example:

```typescript
const stompConfig: StompConfig = {
  // Which server?
  url: socketProvider,

  // Headers
  // Typical keys: login, passcode, host
  headers: {
    login: 'guest',
    passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 5000,

  // Will log diagnostics on console
  debug: true
};
```

