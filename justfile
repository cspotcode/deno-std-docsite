set unstable
set dotenv-load
set positional-arguments
# winget install --id=frippery.busybox-w32 -e
set windows-shell := ['busybox', 'sh', '-eu', '-c']
# TODO cross-platform, don't require busybox on non-Windows
set script-interpreter := ['busybox', 'sh', '-eu']
PATH_SEP := if os() == 'windows' { ';' } else { ':' }
export PATH := justfile_dir() + '/node_modules/.bin' + PATH_SEP + env_var('PATH')

@default:
  just --list --unsorted

# Currently experimenting with two different approaches to docs rendering:
# Typedoc's "resolve" and "packages" strategies.

init:
    # Checkout gh-pages branch into `./docs`
    git worktree add docs gh-pages

doc: docresolve docpackages

docresolve:
    deno run -A npm:typedoc/typedoc --options typedoc-resolve.jsonc

docpackages:
    deno run -A npm:typedoc/typedoc --options typedoc-packages.jsonc

# Not sure this does anything useful, I had hoped to easily render the .json to a single page for feeding into LLMs.
docjson:
    deno run -A npm:typedoc/typedoc --options typedoc-resolve.jsonc --json docs/out.json
