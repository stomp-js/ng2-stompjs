#!/usr/bin/env bash

ng lint && ng test \
&& npm run dist \
&& node bin/pre-publish.js \
&& cd dist \
&& npm publish "$@"
