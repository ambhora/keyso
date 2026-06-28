# Set Operations

Keyso provides set operations over configuration spaces.

## Product

`_product` combines configuration spaces with disjoint types.

```keyso
{
  "_product": [
    {"compiler": ["gcc", "clang"]},
    {"optimization": ["O0", "O2"]}
  ]
}
```

Result:

```keyso
[
  {"compiler": "gcc", "optimization": "O0"},
  {"compiler": "gcc", "optimization": "O2"},
  {"compiler": "clang", "optimization": "O0"},
  {"compiler": "clang", "optimization": "O2"}
]
```

The operands must have disjoint types. This is invalid because both operands contain `compiler`:

```keyso
{
  "_product": [
    {"compiler": ["gcc", "clang"]},
    {"compiler": ["gcc", "intel"]}
  ]
}
```

## Union

`_union` combines configuration spaces with the same type.

```keyso
{
  "_union": [
    {"compiler": ["gcc", "clang"]},
    {"compiler": ["clang", "intel"]}
  ]
}
```

Result:

```keyso
[
  {"compiler": "gcc"},
  {"compiler": "clang"},
  {"compiler": "intel"}
]
```

## Intersection

`_intersection` keeps configurations that are present in all operands.

```keyso
{
  "_intersection": [
    {"compiler": ["gcc", "clang"]},
    {"compiler": ["clang", "intel"]}
  ]
}
```

Result:

```keyso
[
  {"compiler": "clang"}
]
```

## Difference

`_difference` removes the subtrahend space from the minuend space.

```keyso
{
  "_difference": {
    "_minuend": {"compiler": ["gcc", "clang", "intel"]},
    "_subtrahend": {"compiler": ["clang"]}
  }
}
```

Result:

```keyso
[
  {"compiler": "gcc"},
  {"compiler": "intel"}
]
```
