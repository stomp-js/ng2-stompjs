#!/usr/bin/env bash

npm run dist \
&& cd dist \
&& npm publish --access=public
