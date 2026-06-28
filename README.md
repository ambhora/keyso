# Keyso Language Documentation

This repository contains the standalone MkDocs website for the Keyso dictionary language.
It documents the language only and is intentionally separate from any implementation.

## Local preview

```bash
python -m pip install hatch
hatch run docs:serve
```

## Build

```bash
python -m pip install hatch
hatch run docs:build
```

The documentation dependencies are declared in `pyproject.toml` under the Hatch `docs` environment.
