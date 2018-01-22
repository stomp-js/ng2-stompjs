# Using with SockJS

See sample at https://github.com/stomp-js/ng4-stompjs-demo/tree/sockjs

## Notes

- It is an initial release.
- Instead of a `url` in the default form, you need 
to pass it as a `socketProvider` function. It will be streamlined in a
future release.
- Please read notes on SockJS support of the underlying library at
https://stomp-js.github.io/stomp-websocket/codo/extra/docs-src/sockjs.md.html


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

Pass the function as `url` in `StompConfig`.
 It will work even
though name of the parameter is url, don't worry :)

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

  // How frequent is the heartbeat?
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

