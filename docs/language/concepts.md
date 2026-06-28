# Concepts

## Configuration

A configuration is a finite mapping from keys to values.

```keyso
{
  "compiler": "gcc",
  "optimization": "O2"
}
```

This concrete configuration contains two key-value pairs.

## Configuration type

The type of a configuration is the set of keys present in the configuration.

For this configuration:

```keyso
{
  "compiler": "gcc",
  "optimization": "O2"
}
```

The type is:

```text
{compiler, optimization}
```

## Configuration space

A configuration space is a finite set of configurations with the same type.

```keyso
{
  "_set": [
    {"compiler": "gcc", "optimization": "O2"},
    {"compiler": "clang", "optimization": "O3"}
  ]
}
```

Both configurations have the same type:

```text
{compiler, optimization}
```

## Coherence of types

Two configuration spaces have coherent types when their types are equal.

Coherent spaces may be combined using:

- `_union`
- `_intersection`
- `_difference`

Two configuration spaces have anticoherent types when their types are disjoint.

Anticoherent spaces may be combined using:

- `_product`

## Homogeneity

Every configuration space has exactly one type.

This is invalid because the two configurations do not have the same keys:

```keyso
{
  "_set": [
    {"compiler": "gcc"},
    {"compiler": "clang", "optimization": "O2"}
  ]
}
```
