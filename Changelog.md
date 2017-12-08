# Changelog

### 0.6.2

- Added ability to get server headers from CONNECTED Frame 
  https://stomp-js.github.io/ng2-stompjs/classes/stomprservice.html#serverheadersobservable
- Enabled Travis

### 0.6.1

- Updated dependencies

### 0.6.0

- Jump in version number to indicate compiled JS release
- Improved Angular 5 support

### 0.4.3

- Ability to delay initialization
- Angular 5 compatibility

### 0.4.2

- Initial [SockJS Support](https://github.com/stomp-js/ng2-stompjs/blob/master/SockJS.md).
Sample at https://github.com/stomp-js/ng4-stompjs-demo/tree/sockjs

### 0.4.0

- Updated to make it compliant to possible use of APP_INITIALIZER. The way to initiate the service has changed and it no longer uses StompConfigService.
StompConfig is directly injected as dependency into StompService

### 0.3.8

- Switched to source distribution. The npm bundle now only has .ts files

### 0.3.5

- Test case at https://github.com/stomp-js/ng2-stompjs-testbed these
  will be merged into main repository in future. Currently unable
  to configure Karma correctly in the main project. Any help appreciated

### 0.3.4

- Added references to GitHub pages

### 0.3.0

- Configuration structure has changed, user/password are not part of header
- Support for headers in connect, subscribe, and publish
- Typedoc for API documentation

