# RPC - Remote Procedure Call

Messaging usually works one way.
There is however a convention for two way communication (i.e. request/response).
This involves `reply-to` queues which routes the response back to correct client program
and `correlation-id` to uniquely match a response to the correct request.

See: https://www.rabbitmq.com/tutorials/tutorial-six-python.html for a sample using
a very similar approach.

## Implementing the RPC server endpoint

This can be implemented in any language, in most cases it will be there in some backend server.

```typescript
    const myServiceEndPoint = '/topic/echo';

    stompService.subscribe(myServiceEndPoint).subscribe((message: Message) => {
      // The response needs to be sent back here
      const replyTo = message.headers['reply-to'];
      
      // Same correlation id needs to be sent back as message header
      const correlationId = message.headers['correlation-id'];
      
      // Process the request, compute the response
      const incomingMessage = message.body;

      const outgoingMessage = 'Echoing - ' + incomingMessage;
      
      // Send the response back to destination `replyTo` with `correlation-id` header
      stompService.publish(replyTo, outgoingMessage, {'correlation-id' : correlationId});
    });
```

## Using it from the client

### RabbitMQ

RabbitMQ has special support for `temp-queues` in `reply-to` messages
which make things to work magically. Really I mean it.

If you don't believe me check details at https://www.rabbitmq.com/stomp.html#d.tqd

Well the client code looks equally simple and similar to what you would expect
to use with any backend service.

The `StompRPCService` can be created by means of Angular Dependency Injection
or be created manually.
It in turns needs an initialized `StompRService` as
a dependency (or argument).
`StompService` is a derived class of `StompRService`, so that will work as well.

```typescript
    const myServiceEndPoint = '/topic/echo';

    const request = 'Hello';
    // It accepts a optional third argument a Hash of headers to be sent as part of the request
    stompRPCService.rpc(myServiceEndPoint, request).subscribe((message: Message) => {
      // Consume the response
      console.log(message.body);
    });
```

Just like Ajax requests, it will yield only once.

There is another method called `stream` that will not terminate after one response.
This can be used to receive stream of responses for a single request.
If you use that it will be your responsibility to unsubscribe when you do not expect
any additional messages.

### Other Brokers

There are few requirements:

- the reply queue name **must** be unique across the broker.
- ideally, for security reasons only the client creating the queue should have access to it.

Many brokers have `temp-queue` concept which should simplify your work. 

Following gives and outline:

```typescript
  const stompRPCConfigForActiveMQ = {
    // A unique name, BTW angular2-uuid module is already added as dependency
    replyQueueName: `/topic/replies.${UUID.UUID()}`,
    
    // Simply subscribe, you would need to secure by adding broker specific options
    setupReplyQueue: (replyQueueName: string, stompService: StompRService) => {
      return stompService.subscribe(replyQueueName);
    }
  };
```

This custom config would need to be passed as second parameter in `StompRPCService`
constructor, or, can be passed as an Angular Dependency.

Apart from this additional setup step usage remains same as RabbitMQ case as documented above.
