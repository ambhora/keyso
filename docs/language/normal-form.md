# Normal Form

Every finite Keyso document can be represented as an explicit `_set`.

For example:

```keyso
{
  "_product": [
    {"compiler": ["gcc", "clang"]},
    {"optimization": ["O0", "O2"]}
  ]
}
```

has the normal form:

```keyso
{
  "_set": [
    {"compiler": "gcc", "optimization": "O0"},
    {"compiler": "gcc", "optimization": "O2"},
    {"compiler": "clang", "optimization": "O0"},
    {"compiler": "clang", "optimization": "O2"}
  ]
}
```

Normal form is useful for:

- comparing two Keyso documents,
- inspecting the exact generated configuration space,
- removing duplicate configurations,
- serializing the final result of set operations.

## Empty spaces

A set operation may produce an empty configuration space.

```keyso
{
  "_difference": {
    "_minuend": {"compiler": ["gcc"]},
    "_subtrahend": {"compiler": ["gcc"]}
  }
}
```

The result has no configurations, but it still has a type:

```text
{compiler}
```

This matters because empty spaces can still participate in later set operations as typed spaces.
