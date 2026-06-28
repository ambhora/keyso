# Syntax

A Keyso document is a dictionary. A dictionary at a space position must contain exactly one construct.

## Keywords

The following keys are reserved:

```text
_literal
_nested
_set
_product
_union
_intersection
_difference
_minuend
_subtrahend
```

Reserved keywords cannot be used as ordinary configuration keys.

## Key-value mapping

A single ordinary key with a single value describes a configuration space containing one configuration.

```keyso
{"compiler": "gcc"}
```

Result:

```keyso
[
  {"compiler": "gcc"}
]
```

## Key-multivalue mapping

A single ordinary key with a list value describes one configuration for each value.

```keyso
{"compiler": ["gcc", "clang"]}
```

Result:

```keyso
[
  {"compiler": "gcc"},
  {"compiler": "clang"}
]
```

## Explicit set

`_set` explicitly enumerates a finite configuration space.

```keyso
{
  "_set": [
    {"compiler": "gcc", "optimization": "O2"},
    {"compiler": "clang", "optimization": "O3"}
  ]
}
```

The value of `_set` is written as a list because that is the ordinary way to serialize a collection of dictionaries. Semantically, it is a set: duplicate configurations are ignored.

## Single construct rule

A space-position dictionary must contain one construct only.

Valid:

```keyso
{"compiler": ["gcc", "clang"]}
```

Valid:

```keyso
{"_product": [{"compiler": "gcc"}, {"optimization": "O2"}]}
```

Invalid:

```keyso
{
  "compiler": ["gcc", "clang"],
  "optimization": ["O0", "O2"]
}
```
