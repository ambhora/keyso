# Literals and Nesting

Dictionaries can appear in two different roles:

1. as Keyso documents that should be interpreted, or
2. as data values that should be preserved.

To avoid ambiguity, Keyso requires explicit markers for dictionary values.

## Literal values

Use `_literal` when a dictionary is ordinary data.

```keyso
{
  "params": {
    "_literal": {
      "nx": 128,
      "ny": 128,
      "solver": ["cg", "gmres"]
    }
  }
}
```

Result:

```keyso
[
  {
    "params": {
      "nx": 128,
      "ny": 128,
      "solver": ["cg", "gmres"]
    }
  }
]
```

The contents of `_literal` are not interpreted as Keyso.

## Nested Keyso documents

Use `_nested` when the value of a key should be produced by an independent Keyso document.

```keyso
{
  "build": {
    "_nested": {
      "_product": [
        {"compiler": ["gcc", "clang"]},
        {"optimization": ["O2", "O3"]}
      ]
    }
  }
}
```

Result:

```keyso
[
  {"build": {"compiler": "gcc", "optimization": "O2"}},
  {"build": {"compiler": "gcc", "optimization": "O3"}},
  {"build": {"compiler": "clang", "optimization": "O2"}},
  {"build": {"compiler": "clang", "optimization": "O3"}}
]
```

The inner keys are not part of the outer type. The outer type is:

```text
{build}
```

## Plain dictionary values are invalid

This is invalid because it is ambiguous:

```keyso
{
  "params": {
    "nx": 128,
    "ny": 128
  }
}
```

Use `_literal` for data or `_nested` for an independently evaluated Keyso document.
