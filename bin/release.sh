#!/usr/bin/env bash

npm run doc \
&& npm run dist \
&& cd dist \
&& yarn publish --access=public
