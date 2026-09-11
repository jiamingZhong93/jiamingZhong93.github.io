#!/usr/bin/env bash
# Compatibility entry point for the local-only homepage preview.
set -eu
preview_root="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
exec bash "$preview_root/preview.sh" "$@"
