# Load project PATH in any terminal (no direnv):
#   source scripts/shell-env.sh
#
# Then: multi dev up

_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
case ":${PATH}:" in
    *":${_ROOT}/bin:"*) ;;
    *) export PATH="${_ROOT}/bin:${PATH}" ;;
esac
unset _ROOT
