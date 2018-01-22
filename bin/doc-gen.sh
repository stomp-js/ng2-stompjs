#!/usr/bin/env bash
./node_modules/.bin/compodoc -p src/tsconfig.app.json -d docs/ --disablePrivate --disableInternal --disableGraph --includes docs-src --includesName Guides --theme Vagrant --hideGenerator
        "$@"
