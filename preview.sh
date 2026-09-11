#!/usr/bin/env bash
set -eu
preview_root="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$preview_root"
preview_node="$(command -v node || true)"
check_node() {
  [ -n "$1" ] && "$1" -e 'const [major,minor]=process.versions.node.split(".").map(Number);process.exit(major>20||(major===20&&minor>=19)?0:1)' >/dev/null 2>&1
}
if ! check_node "$preview_node"; then
  preview_node="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if ! check_node "$preview_node"; then
  printf '%s\n' 'Install Node.js 20.19 or newer with npm, then run bash preview.sh again.' >&2
  exit 1
fi
exec "$preview_node" "$preview_root/scripts/preview.cjs" "$@"
