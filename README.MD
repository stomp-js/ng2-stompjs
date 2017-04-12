# @stomp/ng2-stompjs

An Angular (Angular2, Angular4, ...) style wrapper for an updated stompjs,
originally developed by [Jeff Mesnil](http://jmesnil.net/).

## Compatibility

The code itself is quite clean and should work with any setup Angular2 and above.
However, packaging as an NPM module has been proven to be clumsy. So, the NPM
module may not work with every possible setup. In case it does not work for your 
setup, please raise a ticket. As interim you may include all the .ts files from
https://github.com/stomp-js/ng2-stompjs/tree/master/src and place these
in your project directly.

Tested with Angular2 (2.4.0) and Angular4 (4.0.0) project created with Angula CLI.

## Installation

To install this library, run:

```bash
$ npm install @stomp/ng2-stompjs --save
```
or, if using yarn

```bash
$ yarn add @stomp/ng2-stompjs
```

This will addtionally install @stomp/stompjs 
from https://github.com/stomp-js/stomp-websocket

## Usage

- See https://github.com/stomp-js/ng4-stompjs-demo for a working sample
  using Angular4 and Angular CLI.
- See https://github.com/stomp-js/ng2-stompjs-demo for a working sample
  using Angular2 and Angular CLI. This version also demonstrates fetching
  Stomp configuration using an http call.

### Prerequisites

- You will need to have a Stomp broker running.
- Sample code on this page assumes you have
  RabbitMQ running with default settings and Web STOMP plugin activated.
  (see: https://www.rabbitmq.com/web-stomp.html).

### All the Hard Work

- The main service is StompService, which will need to be provided.
- The STOMP Broker connection details will need to be provided via another 
  class StompConfigService. Typically you will subclass it to provide configuration.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
  background reading.
- Sample config:

```typescript
const conf: StompConfig= {
    // Which server?
    url: "ws://127.0.0.1:15674/ws",

    user: "guest",
    pass: "guest",

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
}
```
    
- Your ConfigService must extend StompConfigService and implement a method
  `public get(): Observable<StompConfig>`. Example:
  
```typescript
  public get(): Observable<StompConfig> {
    const conf: StompConfig= {
      // as from previous example
    };

    return Observable.of(conf);
  }
```
    
- See https://github.com/stomp-js/ng4-stompjs-demo/blob/master/src/app/services/config/config.service.ts 
  for a sample code file with configuration passed from a local
  hash. Feel free to copy an modify this file.
- See https://github.com/stomp-js/ng2-stompjs-demo/blob/master/src/app/services/config/config.service.ts
  for a sample code file with configuration fetched from a http
  resource.
- Assuming the class you have created for configuration service is 
  `ConfigService`, code sample to provide these service will look like:
  
```typescript
  providers: [
    StompService,
    {
      provide: StompConfigService,
      useClass: ConfigService
    }
  ]
```
    
- See https://github.com/stomp-js/ng4-stompjs-demo/blob/master/src/app/app.module.ts
  for a sample file.

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

Call `subscribe` with name of the queue which returns an Observable. Any
of Observable specific operators (map, filter, subscribe, etc.) cane be
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

Not a likely chance that you would need it.

You will need to unsubscribe from stomp_subscription (which is an Observer),
it will then internally unsubscribe from the underlying STOMP queue
subscription.

#### Publishing messages

Call `public publish(queueName: string, message: string)`. Example:

```typescript
this._stompService.publish('/topic/ng-demo-sub', 'My important message');
```

Please note that message is actually string. So, if you need to send JSON
you will need to convert it into string (typically using 
`JSON.stringify()`)

#### Watching for Stomp Connection status

- `stompService.state` is a `BehaviorSubject` which maintains and switches
  its value as per the underlying Stomp Connection status.
- The value is from an enum with these possible values: 
    CLOSED, TRYING, CONNECTED, and DISCONNECTING.
- The following code will subscribe to `stompService.state` and covert
  the enum value (which is a number) to the corresponding string value:
  
```typescript
    this._stompService.state
      .map((state: number) => StompState[state])
      .subscribe((status: string) => {
      console.log(`Stomp connection status: ${status}`);
    });
```

## Development

After checking out, install the dependencies:

```bash
$ npm install
```
or, if using yarn

```bash
$ yarn
```

It uses `ngc` to build.

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

To publish it uses a shell script which copies, a slightly modified, package.json
into dist/ folder and publishes only the dist/ folder.

```bash
$ bin/npm-publish
```

## Contributors

- [Sam Finnigan](https://github.com/sjmf)
- [Jimi (Dimitris) Charalampidis](https://github.com/JimiC)
- [Deepak Kumar](https://github.com/kum-deepak)
- Everyone involved at https://github.com/stomp-js/stomp-websocket


## License

MIT
