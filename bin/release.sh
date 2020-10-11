#!/usr/bin/env bash

ng lint && ng test \
&& npm run dist \
&& node bin/pre-publish.js \
&& cp README.MD dist/ \
&& cd dist \
&& npm publish "$@"
