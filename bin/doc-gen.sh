#!/usr/bin/env bash

rm -rf docs/

./node_modules/.bin/compodoc \
        -p src/tsconfig.app.json \
        -d docs/ \
        --disablePrivate --disableInternal --disableGraph \
        --includes docs-src --includesName Guides \
        "$@"
