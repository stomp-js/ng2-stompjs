# @stomp/ng2-stompjs

Angular 2/4/5 [![Build Status](https://travis-ci.org/stomp-js/ng2-stompjs.svg?branch=angular4)](https://travis-ci.org/stomp-js/ng2-stompjs)

Angular 6 [![Build Status](https://travis-ci.org/stomp-js/ng2-stompjs.svg?branch=master)](https://travis-ci.org/stomp-js/ng2-stompjs)

An Angular (Angular2, Angular4, Angular5, Angular6 ...) style wrapper for @stomp/stompjs.

## Version Compatibility

While we tried really hard to support multiple Angular versions with same release -
actually succeeded for Anguar 2/4/5, it is not possible for Angular 6. This library
makes quite extensive use of rxjs which has undergone breaking changes in Angular 6.

Going forward following numbering scheme will be followed:

- 6.x.x - managed in `master` branch, will only support Angular 6 - use dependency like "^6.0.0" 
- 4.x.x - managed in `angular4` branch, will support Angular 2/4/5 - use dependency like "^4.0.0"

For the time being both versions will be maintained. From October 2018, only critical
updates will be applied to 4.x.x releases.

As of now both versions offer exactly same APIs.

## Special Request

Recently documentation has been switched to
[Compodoc](https://github.com/compodoc/compodoc) from TypeDoc.
Please raise an issue if you find broken links or inconsistency in documentation.

## Documentation

Please head to https://stomp-js.github.io/ng2-stompjs/

Changelog at https://stomp-js.github.io/ng2-stompjs/changelog.html

## Compatibility

Tested with Angular CLI generated Angular2 (2.4.0), Angular4 (4.0.0), 
Angular (5.0.0). 
It has been reported to work with ionic projects as well.


## Installation

To install this library, run:

```bash
$ npm install @stomp/ng2-stompjs --save
```
or, if using yarn:

```bash
$ yarn add @stomp/ng2-stompjs
```

This will additionally install @stomp/stompjs 
from https://github.com/stomp-js/stomp-websocket


## Usage

- See API documentation at 
  https://stomp-js.github.io/ng2-stompjs/injectables/StompService.html,
  https://stomp-js.github.io/ng2-stompjs/injectables/StompRService.html
  and https://stomp-js.github.io/ng2-stompjs/index.html
- General Demos (using Angular CLI)
    - https://github.com/stomp-js/ng6-stompjs-demo
    - https://github.com/stomp-js/ng5-stompjs-demo
    - https://github.com/stomp-js/ng4-stompjs-demo
    - https://github.com/stomp-js/ng2-stompjs-demo 
- https://github.com/stomp-js/ng2-stompjs-demo also demonstrates fetching
  Stomp configuration using a http call (APP_INITIALIZER)
- See [SockJS Support](https://stomp-js.github.io/ng2-stompjs/additional-documentation/sock-js.html).
  https://github.com/stomp-js/ng4-stompjs-demo/tree/sockjs for a sample
  using SockJS


### SockJS Users

You must read https://stomp-js.github.io/ng2-stompjs/additional-documentation/sock-js.html  


### Prerequisites

- You will need to have a Stomp broker running.
- The sample code on this page assumes you have
  RabbitMQ running with default settings and Web STOMP plugin activated.
  (see: https://www.rabbitmq.com/web-stomp.html.)


### All the Hard Work

- The main service is StompService, which will need to be provided
- The STOMP Broker connection details will need to be provided via  
  class StompConfig. See the samples for several ways to configure it
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
  background reading
- Sample configuration:

```typescript
    const stompConfig: StompConfig = {
      // Which server?
      url: 'ws://127.0.0.1:15674/ws',
    
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
  
- See https://github.com/stomp-js/ng4-stompjs-demo/blob/master/src/app/app.module.ts 
  for a sample code file with configuration passed from a local
  hash. Feel free to copy and modify this file
- See https://github.com/stomp-js/ng2-stompjs-demo/blob/master/src/app/app.module.ts
  for a sample code file with configuration fetched from a http
  resource
- Assuming the config specified as a `const`, code sample to 
  provide `StompService` and `StompConfig` will look like:
  
```typescript
  providers: [
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ]
```
    
- See https://github.com/stomp-js/ng4-stompjs-demo/blob/master/src/app/app.module.ts
  for a sample file


### Reap the Benefits


#### Inject StompService

In your constructor (typically of a component or a service), inject
  `StompService` as a dependency:
  
```typescript
constructor(private _stompService: StompService) { }
```


#### Subscribe to a queue

The queue name structure and semantics vary
based on your specific STOMP Broker, 
see: https://www.rabbitmq.com/stomp.html
for RabbitMQ specific details.

Call `subscribe(queueName: string, headers: StompHeaders = {})` 
with name of the queue which returns an Observable (details at:
https://stomp-js.github.io/ng2-stompjs/injectables/StompRService.html#subscribe). Any
of Observable specific operators (map, filter, subscribe, etc.) can be
applied on it. This can also be set into a template with `async` pipe.

Example:

```typescript
    let stomp_subscription = this._stompService.subscribe('/topic/ng-demo-sub');

    stomp_subscription.map((message: Message) => {
      return message.body;
    }).subscribe((msg_body: string) => {
      console.log(`Received: ${msg_body}`);
    });

```

The `Message` class comes from `@stomp/stompjs`. So, you will need the
following import in the classes where you consume messages:

```typescript
import {Message} from '@stomp/stompjs';
```
    

#### Unsubscribe from a queue

You will need to unsubscribe from stomp_subscription (which is an Observer),
it will then internally unsubscribe from the underlying STOMP queue
subscription.


#### Publishing messages

Call `publish(queueName: string, message: string, headers: StompHeaders = {})` 
(details at: https://stomp-js.github.io/ng2-stompjs/injectables/StompRService.html#publish).
Example:

```typescript
this._stompService.publish('/topic/ng-demo-sub', 'My important message');
```

Please note that `message` is actually string. So, if you need to send JSON
you will need to convert it into string (typically using 
`JSON.stringify()`)


#### Watching for Stomp connection status

- `stompService.state` is a `BehaviorSubject` which maintains and switches
  its value as per the underlying Stomp Connection status.
- The value is from an enum with these possible values: 
    - CLOSED
    - TRYING
    - CONNECTED
    - DISCONNECTING
- The following code will subscribe to `stompService.state` and convert
  the enum value (which is a number) to the corresponding string value:
  
```typescript
    this._stompService.state
      .map((state: number) => StompState[state])
      .subscribe((status: string) => {
      console.log(`Stomp connection status: ${status}`);
    });
```

If you are interested in watching only when connection is established, you can
subscribe to `this._stompService.connectObservable`.


#### Delayed initialization

It is usually possible to use Angular dependency injection techniques and
APP_INITIALIZER to delay the initialization till the configuration is ready
(may be fetched using an API call.) See a sample at:
https://github.com/stomp-js/ng2-stompjs-demo

The initialization process can be manually controlled with the additional 
class `StompRService` which is injected 
instead of `StompService`. This has a few additional
methods to assign a configuration and manually initiate the connection to the STOMP Broker.



```typescript
// Do not provide StompService or StompConfig, only provide StompRService

  providers: [
    StompRService
  ]

```

```typescript
class YourClass {}
    constructor(private _stompService: StompRService) { }
    
    public initStomp() {
      StompConfig config;
  
      cofig = this.fetchConfigFromSomeWhere();
      
      this._stompService.config = config;
      this._stompService.initAndConnect();
    }
}
```

The methods `subscribe` and `publish` can be called even before call to `initAndConnect`.
However these will be queued till the actual connection is successful.

For the curious - `initAndConnect` may be called more than once with a potentially
updated configuration.


## Contributors

- [Sam Finnigan](https://github.com/sjmf)
- [Jimi (Dimitris) Charalampidis](https://github.com/JimiC)
- [Deepak Kumar](https://github.com/kum-deepak)
- Astha Deep
- [Michel Promonet](https://github.com/mpromonet)
- Everyone involved at https://github.com/stomp-js/stomp-websocket


## License

MIT
