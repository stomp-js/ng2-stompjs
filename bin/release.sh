#!/usr/bin/env bash

ng lint && ng test \
&& npm run dist \
&& cd dist \
&& npm publish --access=public
