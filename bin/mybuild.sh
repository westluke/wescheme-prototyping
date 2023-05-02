#!/bin/bash

# Run this from site root

set -x

echo $(pwd)

# Remember, can't use ** in bash directly

compile () {
    npx google-closure-compiler \
        --compilation_level=WHITESPACE_ONLY \
        --js "js-src/**.js" \
        --js "node_modules/google-closure-library/**.js" \
        --dependency_mode=PRUNE \
        --entry_point=./js-src/$1.js \
        --js_output_file static/js/$2-comp.js
}

compile "splash"            "splash"
compile "safeSubmit"        "safeSubmit"
compile "submitpost"        "submitpost"
compile "console"           "console"
compile "loadScript"        "loadScript"
# compile "compiler/index"    "compiler"
# compile "openEditor/index"  "editor"
compile "run"               "run"
compile "view"              "view"

npx google-closure-compiler \
    --compilation_level=WHITESPACE_ONLY \
    --js "js-src/**.js" \
    --js "node_modules/google-closure-library/**.js" \
    --dependency_mode=PRUNE \
    --entry_point=./js-src/compiler/index.js \
    --entry_point=./js-src/openEditor/index.js \
    --js_output_file static/js/editor-comp.js

exit 0

