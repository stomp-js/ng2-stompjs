# @stomp/ng2-stompjs

Angular 6/7 [![Build Status](https://travis-ci.org/stomp-js/ng2-stompjs.svg?branch=master)](https://travis-ci.org/stomp-js/ng2-stompjs)

An Angular (Angular6+) style wrapper for [@stomp/stompjs].

## Version Compatibility

The current version is 7.x.x.
The underlying [@stomp/stompjs] has been bottom rewritten bringing strict compatibility
with [STOMP standards].
This is the first ever STOMP JS client library that reliably supports binary payloads.

This version is recommended for Angular6 and higher.

It has been reported to work with ionic projects as well.

Version 4.x.x may be used with Angular 2/4/5 - use dependency like "^4.0.0".
Documentation for 4.x.x (and 6.x.x) can be accessed at 
[https://stomp-js.github.io/ng2-stompjs/](https://stomp-js.github.io/ng2-stompjs/).

## Upgrading

Please follow [Migrating ng2-stompjs to v7].

## Documentation

- **Highly recommended** step by step guide at [ng2-stompjs with Angular 7]
- Upgrade guide [Migrating ng2-stompjs to v7]
- API documentation is located at: [API Docs]
- [Using STOMP with SockJS]
- [Change Log](Changelog.md)
- [Contributing](Contributing.md)

## Samples

- [stomp-js/ng2-stompjs-angular7] - final output of [ng2-stompjs with Angular 7].
- The original Angular 6 demo upgraded as per [Migrating ng2-stompjs to v7]
  at [Angular 6 ng2stompjs 7].

## Contributors

- [Sam Finnigan](https://github.com/sjmf)
- [Jimi (Dimitris) Charalampidis](https://github.com/JimiC)
- [Deepak Kumar](https://github.com/kum-deepak)
- Astha Deep
- [Michel Promonet](https://github.com/mpromonet)
- Everyone involved at https://github.com/stomp-js/stomp-websocket

## License

MIT

[@stomp/stompjs]: https://github.com/stomp-js/stompjs
[STOMP standards]: https://stomp.github.io/stomp-specification-1.2.html
[API Docs]: https://stomp-js.github.io/api-docs/latest/
[ng2-stompjs with Angular 7]: https://stomp-js.github.io/guide/ng2-stompjs/2018/11/04/ng2-stomp-with-angular7.html
[Migrating ng2-stompjs to v7]: https://stomp-js.github.io/guide/ng2-stompjs/2018/11/05/migrate-ng2-stompjs-v7.html
[Using STOMP with SockJS]: https://stomp-js.github.io/guide/stompjs/rx-stomp/ng2-stompjs/2018/09/10/using-stomp-with-sockjs.html
[stomp-js/ng2-stompjs-angular7]: https://github.com/stomp-js/ng2-stompjs-angular7
[Angular 6 ng2stompjs 7]: https://github.com/stomp-js/ng6-stompjs-demo/tree/ng2-stompjs-v7
