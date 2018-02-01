#!/usr/bin/env bash

npm run doc \
&& npm run dist \
&& cd dist \
&& npm publish --access=public
